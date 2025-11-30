
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
  type: string,
  created_at: number,
) {
  const result = await safeRun(db,
    "INSERT INTO culture_media (type, created_at) VALUES (?, ?)",
    [type, created_at]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, "SELECT * FROM culture_media ORDER BY id ASC");
}

export async function readType(db: SQLiteDatabase, type: string) {
  return await safeSelect(db, `SELECT * FROM culture_media WHERE type = ? ORDER BY id ASC`, [type]);

}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    type: string;
    created_at: number;
  }>(db, "SELECT * FROM culture_media WHERE id = ?", [id]);
}

export async function update(
    db: SQLiteDatabase,
    type: string,
    created_at: number,
) {
  const result = await safeRun(
    db,
    `UPDATE culture_media
       SET type = ?, created_at = ?
       WHERE id = ?`,
    [type, created_at]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM culture_media WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM culture_media WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

