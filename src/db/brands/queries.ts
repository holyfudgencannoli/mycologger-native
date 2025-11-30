
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
  item_id: number,
  name: string,
  website: string,
  last_updated: number
) {
  const result = await safeRun(db,
    "INSERT INTO brands (item_id, name, website, last_updated) VALUES (?, ?, ?, ?)",
    [item_id, name, website, last_updated]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, "SELECT * FROM brands ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    item_id: number;
    name: string;
    website: string;
    last_updated: number;
  }>(db, "SELECT * FROM brands WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<{
    id: number;
    item_id: number;
    name: string;
    website: string;
    last_updated: number;

  }>(db, "SELECT * FROM brands WHERE name = ?", [name]);
}

export async function update(
  db: SQLiteDatabase,
  id: number,
  name: string,
  website: string,
  last_updated: number
) {
  const result = await safeRun(
    db,
    `UPDATE brands
       SET name = ?, website = ?, last_updated = ?
       WHERE id = ?`,
    [name, website, id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM brands WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM brands WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

