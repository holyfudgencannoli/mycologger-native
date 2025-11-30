
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
  item_id: number,
  name: string,
  category: string,
  subcategory: string
) {
  const result = await safeRun(db,
    "INSERT INTO raw_materials (item_id, name, category, subcategory) VALUES (?, ?, ?, ?)",
    [item_id, name, category, subcategory]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, "SELECT * FROM raw_materials ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    item_id: number;
    name: string;
    category: string;
    subcategory: string;
  }>(db, "SELECT * FROM raw_materials WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<{
    id: number;
    item_id: number;
    name: string;
    category: string;
    subcategory: string;
  }>(db, "SELECT * FROM raw_materials WHERE name = ?", [name]);
}

export async function update(
  db: SQLiteDatabase,
  id: number,
  name: string,
  category: string,
  subcategory: string
) {
  const result = await safeRun(
    db,
    `UPDATE raw_materials
       SET name = ?, category = ?, subcategory = ?
       WHERE id = ?`,
    [name, category, subcategory, id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM raw_materials WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM raw_materials WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

