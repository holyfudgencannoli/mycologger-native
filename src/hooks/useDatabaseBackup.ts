// hooks/useDatabaseBackup.ts
import { useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { checkpointAndCloseForBackup, useSQLiteContext } from '@db';
import * as SQLite from 'expo-sqlite';
import { Workbook } from 'exceljs';
import { Buffer as NodeBuffer } from 'buffer'; 
import* as RNFS from 'react-native-fs'

const docDir = FileSystem.documentDirectory!;
const SQLITE_DIR = `${docDir}SQLite/`;
const BACKUP_PATH = `${docDir}latest_mycologger_backup.db`;
const EXCEL_PATH = ` file://storage/emulated/0/Documents/mycologger_backup.xlsx`;


/**
 * Convert an ArrayBuffer → base64 string (RN does not expose btoa).
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

/**
 * Convert a base64 string → ArrayBuffer.
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = Buffer.from(base64, 'base64').toString();
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; ++i) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Open the SQLite database that lives in the app’s data folder.
 */
function openDb() {
  // The file name is relative to the app's data directory
  return SQLite.openDatabaseAsync('mycologger.db');
}


export function useDatabaseBackup() {
  const mainPath = `${SQLITE_DIR}mycologger.db`;
  const walPath = `${mainPath}-wal`;
  const shmPath = `${mainPath}-shm`;

  const exportDb = useCallback(async (): Promise<string> => {
    console.log('Creating safe backup...');

    await checkpointAndCloseForBackup();
    await new Promise(r => setTimeout(r, 200)); // let OS settle

    const copy = async (from: string, to: string) => {
      const info = await FileSystem.getInfoAsync(from);
      if (info.exists && !info.isDirectory) {
        await FileSystem.copyAsync({ from, to });
        console.log('Copied:', from);
      }
    };

    await Promise.all([
      copy(mainPath, BACKUP_PATH),
      copy(walPath, `${BACKUP_PATH}-wal`),
      copy(shmPath, `${BACKUP_PATH}-shm`),
    ]);

    console.log('Backup ready →', BACKUP_PATH);
    return BACKUP_PATH;
  }, []);

  const importDb = useCallback(async () => {
    console.log('Restoring database...');
    await checkpointAndCloseForBackup();

    await Promise.all([
      FileSystem.deleteAsync(mainPath, { idempotent: true }),
      FileSystem.deleteAsync(walPath, { idempotent: true }),
      FileSystem.deleteAsync(shmPath, { idempotent: true }),
    ]);

    const copy = async (from: string, to: string) => {
      const info = await FileSystem.getInfoAsync(from);
      if (!info.exists) throw new Error(`Missing backup file: ${from}`);
      await FileSystem.copyAsync({ from, to });
    };

    await Promise.all([
      copy(BACKUP_PATH, mainPath),
      copy(`${BACKUP_PATH}-wal`, walPath),
      copy(`${BACKUP_PATH}-shm`, shmPath),
    ]);

    console.log('Restore complete – DB will reopen on next query');
  }, []);

// -------------------------------------------------------------
  // 3.2  Export to Excel
  // -------------------------------------------------------------
  const exportToExcel = useCallback(async (): Promise<string> => {
		console.log('Exporting database → Excel…');
		await checkpointAndCloseForBackup();
		await new Promise(r => setTimeout(r, 300)); // give OS time

		// Open fresh DB instance (avoid singleton conflicts)
		const db = await SQLite.openDatabaseAsync('mycologger.db');

		try {
			const result = db.getAllSync<{ name: string }>(`
				SELECT name FROM sqlite_master 
				WHERE type = 'table' 
					AND name NOT LIKE 'sqlite_%' 
					AND name NOT LIKE 'android_%'
					AND name != 'sqlite_sequence';
			`);

			const tables: string[] = result.map(r => r.name);
			const workbook = new Workbook();

			for (const table of tables) {
				const rows = db.getAllSync<Record<string, any>>(`SELECT * FROM "${table}"`);

				const sheet = workbook.addWorksheet(table, {
					properties: { defaultColWidth: 15 },
				});

				if (rows.length === 0) {
					sheet.addRow(['No data']);
					continue;
				}

				const columns = Object.keys(rows[0]);
				sheet.columns = columns.map(col => ({
					header: col,
					key: col,
					width: Math.max(col.length, 12),
				}));

				sheet.addRows(rows.map(row => columns.map(col => row[col])));
			}

			const buffer = await workbook.xlsx.writeBuffer();
			const base64 = Buffer.from(buffer).toString('base64');

			await FileSystem.writeAsStringAsync(EXCEL_PATH, base64, {
				encoding: FileSystem.EncodingType.Base64,
			});

			console.log('Excel export ready →', EXCEL_PATH);
			return EXCEL_PATH;
		} finally {
			await db.closeAsync();
		}
	}, []);

  // -------------------------------------------------------------
  // 3.3  Import from Excel
  // -------------------------------------------------------------
	const importFromExcel = useCallback(
		async (fileUri: string) => {
			if (!fileUri) throw new Error("No file selected");

			console.log("Importing from Excel…", fileUri);

			await checkpointAndCloseForBackup();
			await new Promise(r => setTimeout(r, 300));

			// Read file picked from external storage (copyUri)
			const base64 = await FileSystem.readAsStringAsync(fileUri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			if (!base64) throw new Error("Could not read Excel file");

			// Convert to Uint8Array (Buffer-free, always works in RN)
			const binary = atob(base64);
			const uint = base64ToArrayBuffer(binary);

			// Load workbook
			const workbook = new Workbook();
			await workbook.xlsx.load(uint);

			const db = await SQLite.openDatabaseAsync("mycologger.db");

			try {
				await db.execAsync("BEGIN TRANSACTION;");

				for (const sheet of workbook.worksheets) {
					const tableName = sheet.name.replace(/[^a-zA-Z0-9_]/g, "");
					if (!tableName) continue;

					// Check if table exists
					const exists = db.getFirstSync<{ count: number }>(
						`SELECT COUNT(*) as count 
						FROM sqlite_master 
						WHERE type='table' AND name=?`,
						[tableName]
					);

					if (!exists || exists.count === 0) {
						console.warn(`Skipping missing table: ${tableName}`);
						continue;
					}

					// Clear table
					await db.execAsync(`DELETE FROM "${tableName}";`);

					const rows: any[] = [];
					sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
						if (rowNumber === 1) return; // Skip header

						const obj: Record<string, any> = {};
						row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
							const header =
								sheet.getRow(1).getCell(colNumber).value?.toString() ||
								`col${colNumber}`;
							obj[header] = cell.value;
						});

						rows.push(obj);
					});

					if (rows.length === 0) continue;

					const columns = Object.keys(rows[0]);
					const placeholders = columns.map(() => "?").join(",");
					const sql = `INSERT INTO "${tableName}" ("${columns.join(
						'","'
					)}") VALUES (${placeholders});`;

					for (const row of rows) {
						const values = columns.map(col => {
							const val = row[col];
							if (val === null || val === undefined) return null;
							if (typeof val === "object" && "result" in val) return null;
							if (typeof val === "object" && "text" in val) return val.text;
							return val;
						});

						db.runSync(sql, values);
					}
				}

				await db.execAsync("COMMIT;");
				console.log("Excel import completed successfully");
			} catch (err) {
				await db.execAsync("ROLLBACK;");
				throw err;
			} finally {
				await db.closeAsync();
			}
		},
		[]
	);
 // -------------------------------------------------------------
  // 3.4  Return all helpers
  // -------------------------------------------------------------
  return { exportDb, importDb, exportToExcel, importFromExcel };
}