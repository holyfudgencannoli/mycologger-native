// src/db/index.ts
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mycologger.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isOpen = false;

// Internal promise for async open
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Use inside React components.
 * Always returns the same instance if already open.
 * Throws if called before DB is ready in non-async context.
 */
export const getDb = (): SQLite.SQLiteDatabase => {
  if (dbInstance) {
    return dbInstance;
  }
  throw new Error(
    'DB not initialized yet. Use getDb() in async context or await openDb() before rendering.'
  );
};

/**
 * Async getter — safe for utils, hooks, effects, backup, etc.
 */
export const useSQLiteContext = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) return dbInstance;

  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
        PRAGMA cache_size = -20000; -- 20 MB cache
      `);
      dbInstance = db;
      isOpen = true;
      console.log('SQLite database opened:', DB_NAME);
      return db;
    })();
  }

  return await dbPromise;
};

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
