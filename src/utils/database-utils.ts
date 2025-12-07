// databaseBackup.ts
import * as FileSystem from 'expo-file-system/legacy';
import * as SQLite from 'expo-sqlite';
import { Workbook } from 'exceljs';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';
import { Platform } from 'react-native';
import { checkpointAndCloseForBackup } from '@db/utils';
import { CaseHelper } from './case-helper';

const { StorageAccessFramework } = FileSystem;

const docDir = FileSystem.documentDirectory!;
const SQLITE_DIR = `${docDir}SQLite/`;
const DEFAULT_DB_NAME = 'mycologger.db';
const DEFAULT_BACKUP_DB_PATH = `${docDir}latest_mycologger_backup.db`;
const DEFAULT_EXCEL_PATH = `${docDir}mycologger_backup.xlsx`;

// --------------------------------------------------
// SAF Helpers
// --------------------------------------------------
async function requestAndroidFolder() {
  const perm = await StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!perm.granted) throw new Error("Folder permission denied.");
  return perm.directoryUri;
}

async function saveFileWithSAF(base64: string, filename: string) {
  // iOS fallback (saved in app docs folder)
  if (Platform.OS !== 'android') {
    const iosPath = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(iosPath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return iosPath;
  }

  // ANDROID SAF
  const dirUri = await requestAndroidFolder();

  // Create file inside selected folder
  const fileUri = await StorageAccessFramework.createFileAsync(
    dirUri,
    filename,
    "application/octet-stream"
  );

  // Write base64 data
  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  console.log("Saved via SAF →", fileUri);
  return fileUri;
}

// --------------------------------------------------
// File Utilities
// --------------------------------------------------
async function copyFileIfExists(from: string, to: string) {
  const info = await FileSystem.getInfoAsync(from);
  if (info.exists && !info.isDirectory) {
    await FileSystem.copyAsync({ from, to });
  }
}

async function deleteFileIfExists(path: string) {
  await FileSystem.deleteAsync(path, { idempotent: true });
}

// --------------------------------------------------
// Database Utilities
// --------------------------------------------------
export async function openDb(dbName = DEFAULT_DB_NAME) {
  return SQLite.openDatabaseAsync(dbName);
}

// --------------------------------------------------
// EXPORT DATABASE (SQLite backup)
// --------------------------------------------------
export async function exportDb(
  dbName = DEFAULT_DB_NAME,
  backupPath = DEFAULT_BACKUP_DB_PATH
) {
  console.log('Creating safe backup…');
  await checkpointAndCloseForBackup();

  const mainPath = `${SQLITE_DIR}${dbName}`;
  const walPath = `${mainPath}-wal`;
  const shmPath = `${mainPath}-shm`;

  try{
    const [res1, res2, res3] = await Promise.all([
      copyFileIfExists(mainPath, backupPath),
      copyFileIfExists(walPath, `${backupPath}-wal`),
      copyFileIfExists(shmPath, `${backupPath}-shm`),
    ]);

    console.log(res1, res2, res3);
  } catch (err) {
    console.error("Promise.all Error: ", err)
  }


  console.log('Backup created →', backupPath);

  // Convert backup DB to base64
  const base64 = await FileSystem.readAsStringAsync(backupPath, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Save with SAF (Android) or docs folder (iOS)
  return saveFileWithSAF(base64, "mycologger_backup.db");
}

// --------------------------------------------------
// IMPORT DATABASE (SQLite restore)
// --------------------------------------------------
export async function importDb(dbName = DEFAULT_DB_NAME, backupPath = DEFAULT_BACKUP_DB_PATH) {
  console.log('Restoring database…');
  await checkpointAndCloseForBackup();

  const mainPath = `${SQLITE_DIR}${dbName}`;
  const walPath = `${mainPath}-wal`;
  const shmPath = `${mainPath}-shm`;

  try{
    const [res1, res2, res3] = await Promise.all([
      deleteFileIfExists(mainPath),
      deleteFileIfExists(walPath),
      deleteFileIfExists(shmPath),
    ]);
  } catch (err) {
    console.error("Promise.all Error: ", err)
  }

  try{
    const [res1, res2, res3] = await Promise.all([
      copyFileIfExists(backupPath, mainPath),
      copyFileIfExists(`${backupPath}-wal`, walPath),
      copyFileIfExists(`${backupPath}-shm`, shmPath),
    ]);
  } catch (err) {
    console.error("Promise.all Error: ", err)
  }

  console.log('Restore complete — DB will reopen on next query');
}

// --------------------------------------------------
// EXPORT TO EXCEL (via SAF)
// --------------------------------------------------
export async function exportToExcel(dbName = DEFAULT_DB_NAME, excelPath = DEFAULT_EXCEL_PATH) {
  console.log('Exporting database → Excel…');
  await checkpointAndCloseForBackup();

  const db = await openDb(dbName);

  try {
    const tables: string[] = db
      .getAllSync<{ name: string }>(
        `SELECT name FROM sqlite_master 
         WHERE type='table' 
         AND name NOT LIKE 'sqlite_%'
         AND name NOT LIKE 'android_%'
         AND name != 'sqlite_sequence';`
      )
      .map(r => r.name);

    const workbook: ExcelJS.Workbook = new Workbook();

    for (const table of tables) {
      const rows = db.getAllSync<Record<string, string[]>>(`SELECT * FROM "${table}"`);
      const sheet: ExcelJS.Worksheet = workbook.addWorksheet(CaseHelper.toCleanCase(table), { properties: { defaultColWidth: 15 } });

      if (rows.length === 0) {
        sheet.addRow(['No data']);
        continue;
      }

      const columns = Object.keys(rows[0]);
      sheet.columns = columns.map(col => ({
        header: CaseHelper.toCleanCase(col),
        key: col,
        width: Math.max(col.length, 12)
      }));

      sheet.addRows(rows.map(row => columns.map(col => CaseHelper.toCleanCase(row[col]))));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    await FileSystem.writeAsStringAsync(excelPath, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Excel export ready →', excelPath);

    // SAVE TO_ANDROID using SAF
    return saveFileWithSAF(base64, "mycologger_backup.xlsx");

  } finally {
    await db.closeAsync();
  }
}

// --------------------------------------------------
// IMPORT FROM EXCEL
// --------------------------------------------------
export async function importFromExcel(fileUri: string, dbName = DEFAULT_DB_NAME) {
  if (!fileUri) throw new Error('No file selected');
  console.log('Importing from Excel…', fileUri);

  await checkpointAndCloseForBackup();

  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (!base64) throw new Error('Could not read Excel file');

  const workbook: any = new Workbook();
  await workbook.xlsx.load(Buffer.from(base64, 'base64'));

  const db = await openDb(dbName);

  try {
    await db.execAsync('BEGIN TRANSACTION;');

    for (const sheet of workbook.worksheets) {
      const tableName = sheet.name.replace(/[^a-zA-Z0-9_]/g, '');
      if (!tableName) continue;

      const exists = db.getFirstSync<{ count: number }>(
        `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name=?`,
        [tableName]
      );

      if (!exists || exists.count === 0) {
        console.warn(`Skipping missing table: ${tableName}`);
        continue;
      }

      await db.execAsync(`DELETE FROM "${tableName}";`);

      const rows: Record<string, any>[] = [];
      sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;
        const obj: Record<string, any> = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = sheet.getRow(1).getCell(colNumber).value?.toString() || `col${colNumber}`;
          obj[header] = cell.value;
        });
        rows.push(obj);
      });

      if (!rows.length) continue;

      const columns = Object.keys(rows[0]);
      const placeholders = columns.map(() => '?').join(',');
      const sql = `INSERT INTO "${tableName}" ("${columns.join('","')}") VALUES (${placeholders});`;

      for (const row of rows) {
        const values = columns.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return null;
          if (typeof val === 'object' && 'text' in val) return val.text;
          return val;
        });
        db.runSync(sql, values);
      }
    }

    await db.execAsync('COMMIT;');
    console.log('Excel import completed successfully');
  } catch (err) {
    await db.execAsync('ROLLBACK;');
    throw err;
  } finally {
    await db.closeAsync();
  }
}
