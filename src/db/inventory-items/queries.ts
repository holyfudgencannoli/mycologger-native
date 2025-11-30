
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelectOne } from "../utils";

export async function create(
  db: SQLiteDatabase,
  type: string,
  created_at: number
) {
  const result = await safeRun(db,
    "INSERT INTO inventory_items (type, created_at) VALUES (?, ?)",
    [type, created_at]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeExec(db, "SELECT * FROM inventory_items ORDER BY id DESC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    type: string;
    created_at: number;
  }>(db, "SELECT * FROM inventory_items WHERE id = ?", [id]);
}

export async function update(
  db: SQLiteDatabase,
  id: number,
  type: string,
) {
  const result = await safeRun(
    db,
    `UPDATE inventory_items
       SET type = ?
       WHERE id = ?`,
    [type, id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM inventory_items WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM inventory_items WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}
