import { SQLiteDatabase, SQLiteBindParams, SQLiteRunResult } from "expo-sqlite";

export async function safeExec(db: SQLiteDatabase, query: string) {
  try {
    console.log("Running query:", query);
    await db.execAsync(query);
    console.log("✅ Success");
  } catch (err) {
    console.error("❌ Error running query:", query, err);
    throw err; // optional, to stop further migration
  }
}

export async function safeRun(db: SQLiteDatabase, query: string, params: SQLiteBindParams) {
  try {
    console.log("Running query:", query);
    const result = await db.runAsync(query, params);
    console.log("✅ Success");
    return result
  } catch (err) {
    console.error("❌ Error running query:", query, err);
    throw err; // optional, to stop further migration
  }
}

export async function safeSelect<T>(
  db: SQLiteDatabase,
  sql: string,
  params: SQLiteBindParams
): Promise<T[]> {
  try {
    console.log("➡️ SELECT:", sql, params);
    return await db.getAllAsync<T>(sql, params);
  } catch (e) {
    console.error("❌ SELECT ERROR:", sql, params, e);
    throw e;
  }
}

export async function safeSelectOne<T>(
  db: SQLiteDatabase,
  sql: string,
  params: SQLiteBindParams
): Promise<T | null> {
  const rows = await safeSelect<T>(db, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function safeSelectAll<T>(db: SQLiteDatabase, query: string, params: any[] = []) {
  try {
    console.log("Running query:", query, params);
    const rows = await db.getAllAsync<T>(query, params);
    console.log("✅ SELECT success");
    return rows;
  } catch (err) {
    console.error("❌ SELECT error:", query, params, err);
    throw err;
  }
}

// src/db/index.ts
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mycologger.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isOpen = false;

// Internal promise for async open
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;


// /**
//  * Async getter — safe for utils, hooks, effects, backup, etc.
//  */
// export const useSQLiteContext = async (): Promise<SQLite.SQLiteDatabase> => {
//   if (dbInstance) return dbInstance;

//   if (!dbPromise) {
//     dbPromise = (async () => {
//       const db = await SQLite.openDatabaseAsync(DB_NAME);
//       await db.execAsync(`
//         PRAGMA journal_mode = WAL;
//         PRAGMA foreign_keys = ON;
//         PRAGMA cache_size = -20000; -- 20 MB cache
//       `);
//       dbInstance = db;
//       isOpen = true;
//       console.log('SQLite database opened:', DB_NAME);
//       return db;
//     })();
//   }

//   return await dbPromise;
// };

/**
 * Close DB safely for backup/restore
 */
export const checkpointAndCloseForBackup = async () => {
  if (!dbInstance || !isOpen) return;

  try {
    console.log('Checkpointing and closing DB for backup...');
    await dbInstance.execAsync('PRAGMA wal_checkpoint(FULL);');
  } catch (e) {
    console.warn('Checkpoint failed (usually safe):', e);
  }

  await dbInstance.closeAsync();
  dbInstance = null;
  isOpen = false;
  dbPromise = null;
};

/**
 * Check if DB is open
 */
export const isDatabaseOpen = () => isOpen;
