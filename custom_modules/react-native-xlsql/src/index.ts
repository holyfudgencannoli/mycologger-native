/**
 * XLSQL — Safe DB backup & Excel import/export (Expo SDK 50+)
 *
 * Features:
 *  - Full SQLite backup & restore
 *  - Export / import to Excel (.xlsx)
 *  - Fully async/await, safe for large tables
 *  - No callbacks, minimal promise syntax
 *  - Handles rich-text cells and large row sets without stack overflows
 */

import * as FileSystem from "expo-file-system/legacy";
import { EncodingType } from "expo-file-system/legacy";
import type { SQLiteDatabase } from "expo-sqlite";
import { Workbook } from "exceljs";
import { Buffer } from "buffer";

/* -------------------------------------------------------------------------- */
/*  File paths                                                                 */
/* -------------------------------------------------------------------------- */

const DOC_DIR = FileSystem.documentDirectory!;
const SQLITE_DIR = `${DOC_DIR}SQLite/`;

const BACKUP_PATH = `${DOC_DIR}latest_mycologger_backup.db`;
const EXCEL_PATH  = `${DOC_DIR}mycologger_export.xlsx`;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const arrayBufferToBase64 = (buf: ArrayBuffer) =>
  Buffer.from(buf).toString("base64");

const base64ToUint8 = (b64: string) =>
  new Uint8Array(Buffer.from(b64, "base64"));

/* -------------------------------------------------------------------------- */
/*  WAL checkpoint (optional, before backup only)                              */
/* -------------------------------------------------------------------------- */

export async function checkpoint(db: SQLiteDatabase): Promise<void> {
  try {
    console.log("[sqlite] Running WAL checkpoint…");
    await db.execAsync("PRAGMA wal_checkpoint(FULL);");
  } catch (err) {
    console.warn("WAL checkpoint failed (usually harmless)", err);
  }
}

/* -------------------------------------------------------------------------- */
/*  1. DATABASE BACKUP                                                         */
/* -------------------------------------------------------------------------- */

export async function exportDb(db: SQLiteDatabase): Promise<string> {
  console.log("Exporting DB backup…");

  await checkpoint(db); // checkpoint only for backup
  await sleep(100);

  const copyIfExists = async (from: string, to: string) => {
    const info = await FileSystem.getInfoAsync(from);
    if (info.exists && !info.isDirectory) {
      await FileSystem.copyAsync({ from, to });
      console.log(`Copied: ${from} → ${to}`);
    }
  };

  await copyIfExists(`${SQLITE_DIR}mycologger.db`, BACKUP_PATH);
  await copyIfExists(`${SQLITE_DIR}mycologger.db-wal`, `${BACKUP_PATH}-wal`);
  await copyIfExists(`${SQLITE_DIR}mycologger.db-shm`, `${BACKUP_PATH}-shm`);

  console.log("Backup complete →", BACKUP_PATH);
  return BACKUP_PATH;
}

/* -------------------------------------------------------------------------- */
/*  2. DATABASE RESTORE                                                        */
/* -------------------------------------------------------------------------- */

export async function importDb(db: SQLiteDatabase): Promise<void> {
  console.log("Restoring DB backup…");

  await checkpoint(db);
  await sleep(100);

  // Delete existing DB files
  await Promise.all([
    FileSystem.deleteAsync(`${SQLITE_DIR}mycologger.db`, { idempotent: true }),
    FileSystem.deleteAsync(`${SQLITE_DIR}mycologger.db-wal`, { idempotent: true }),
    FileSystem.deleteAsync(`${SQLITE_DIR}mycologger.db-shm`, { idempotent: true }),
  ]);

  const copyOrFail = async (from: string, to: string) => {
    const info = await FileSystem.getInfoAsync(from);
    if (!info.exists) throw new Error(`Missing backup file: ${from}`);
    await FileSystem.copyAsync({ from, to });
  };

  await copyOrFail(BACKUP_PATH, `${SQLITE_DIR}mycologger.db`);
  await copyOrFail(`${BACKUP_PATH}-wal`, `${SQLITE_DIR}mycologger.db-wal`);
  await copyOrFail(`${BACKUP_PATH}-shm`, `${SQLITE_DIR}mycologger.db-shm`);

  console.log("Restore completed.");
}

/* -------------------------------------------------------------------------- */
/*  3. EXPORT -> EXCEL                                                         */
/* -------------------------------------------------------------------------- */

export async function exportToExcel(db: SQLiteDatabase): Promise<string> {
  console.log("Exporting DB → Excel…");

  const workbook = new Workbook();

  // Get all user tables
  const tables = await db.getAllAsync<{ name: string }>(`
    SELECT name FROM sqlite_master
    WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
      AND name NOT LIKE 'android_%'
      AND name != 'sqlite_sequence';
  `);

  for (const { name: table } of tables) {
    const rows = await db.getAllAsync<Record<string, any>>(`SELECT * FROM "${table}";`);
    const sheet = workbook.addWorksheet(table);

    if (!rows.length) {
      sheet.addRow(["<empty>"]);
      continue;
    }

    const columns = Object.keys(rows[0]);
    sheet.columns = columns.map(col => ({ header: col, key: col, width: Math.max(12, col.length) }));

    // Insert rows safely with micro-yield to avoid call stack overflow
    for (const row of rows) {
      await sleep(0);
      sheet.addRow(columns.map(c => row[c]));
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = arrayBufferToBase64(buffer);

  await FileSystem.writeAsStringAsync(EXCEL_PATH, base64, { encoding: EncodingType.Base64 });
  console.log("Excel file written →", EXCEL_PATH);

  return EXCEL_PATH;
}

/* -------------------------------------------------------------------------- */
/*  4. IMPORT <- EXCEL                                                         */
/* -------------------------------------------------------------------------- */

export async function importFromExcel(db: SQLiteDatabase, uri: string): Promise<void> {
  console.log("Importing Excel → DB…");

  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: EncodingType.Base64 });
  const workbook: any = new Workbook();
  await workbook.xlsx.load(base64ToUint8(base64));

  await db.execAsync("BEGIN TRANSACTION;");

  try {
    for (const sheet of workbook.worksheets) {
      const table = sheet.name.replace(/[^a-zA-Z0-9_]/g, "");
      if (!table) continue;

      const row = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) AS count FROM sqlite_master WHERE type='table' AND name=?;",
        [table]
      );

      if (!row?.count) {
        console.warn("Skipping missing table:", table);
        continue;
      }

      await db.execAsync(`DELETE FROM "${table}";`);

      const headers = sheet.getRow(1).values.filter(Boolean).map(String);

      for (let r = 2; r <= sheet.rowCount; r++) {
        const rowObj = sheet.getRow(r);
        if (!rowObj || rowObj.values.length === 0) continue;

        const values = headers.map((h, i) => {
          const v = rowObj.getCell(i + 1).value;
          if (v && typeof v === "object" && "text" in v) return v.text;
          return v ?? null;
        });

        const placeholders = headers.map(() => "?").join(",");
        const sql = `INSERT INTO "${table}" (${headers.map(h => `"${h}"`).join(",")}) VALUES (${placeholders});`;

        // Yield to event loop to prevent call stack overflow
        await sleep(0);
        await db.runAsync(sql, values);
      }
    }

    await db.execAsync("COMMIT;");
    console.log("Excel import complete.");
  } catch (err) {
    await db.execAsync("ROLLBACK;");
    throw err;
  }
}
