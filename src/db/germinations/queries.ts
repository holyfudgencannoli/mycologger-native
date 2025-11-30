
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
  notes: string,
  created_at: number,
) {
  const result = await safeRun(db,
    "INSERT INTO germinations (notes, created_at) VALUES (?, ?)",
    [notes, created_at]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, "SELECT * FROM germinations ORDER BY id ASC");
}


export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    notes: string;
    created_at: number;
  }>(db, "SELECT * FROM germinations WHERE id = ?", [id]);
}

export async function update(
    db: SQLiteDatabase,
    notes: string,
    created_at: number,
) {
  const result = await safeRun(
    db,
    `UPDATE germinations
       notes type = ?, created_at = ?
       WHERE id = ?`,
    [notes, created_at]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM germinations WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM germinations WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

