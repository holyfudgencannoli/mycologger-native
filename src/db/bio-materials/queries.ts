
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
  item_id: number,
  name: string,
  category: string,
  species_latin: string
) {
  const result = await safeRun(db,
    "INSERT INTO bio_materials (item_id, name, category, species_latin) VALUES (?, ?, ?, ?)",
    [item_id, name, category, species_latin]
  );

  return result.lastInsertRowId;
}

export async function readAll<BioMaterial>(db: SQLiteDatabase) {
  return await safeSelectAll<BioMaterial>(db, "SELECT * FROM bio_materials ORDER BY id ASC");
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
    species_latin: string;
  }>(db, "SELECT * FROM bio_materials WHERE id = ?", [id]);
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
    species_latin: string;
  }>(db, "SELECT * FROM bio_materials WHERE name = ?", [name]);
}

export async function update(
  db: SQLiteDatabase,
  id: number,
  name: string,
  category: string,
  species_latin: string
) {
  const result = await safeRun(
    db,
    `UPDATE bio_materials
       SET name = ?, category = ?, species_latin = ?
       WHERE id = ?`,
    [name, category, species_latin, id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM bio_materials WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM bio_materials WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

