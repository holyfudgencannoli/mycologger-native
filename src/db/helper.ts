import { getDb } from"@db";
import { SQLiteDatabase } from "expo-sqlite";

// src/db/index.ts  ← add this at the bottom
let _cachedDb: SQLiteDatabase;

/**
 * Use this instead of await getDb() everywhere
 * First call: awaits
 * All next calls: returns instantly (no await needed)
 */
export const db = async (): Promise<SQLiteDatabase> => {
  if (!_cachedDb) {
    _cachedDb = await getDb();
  }
  return _cachedDb;
};