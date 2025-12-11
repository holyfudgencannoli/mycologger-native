
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { ReceiptProps } from "./types";

export async function create(
  db: SQLiteDatabase,
  purch_log_id: number,
  image_uri: string,
  created_at: number,
) {
  const result = await safeRun(db,
    "INSERT INTO receipts (image_uri, purch_log_id, created_at) VALUES (?, ?, ?)",
    [
			image_uri,
      purch_log_id,
      created_at
		]
  );

  return result.lastInsertRowId;
}

export async function readAll<ReceiptProps>(db: SQLiteDatabase) {
  return await safeSelectAll<ReceiptProps>(db, "SELECT * FROM receipts ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<ReceiptProps>(db, "SELECT * FROM receipts WHERE id = ?", [id]);
}

export async function getByLogId(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<ReceiptProps>(db, "SELECT * FROM receipts WHERE purch_log_id = ?", [id]);
}

export async function update(
  db: SQLiteDatabase,
  purch_log_id: number,
	image_uri: string,
  created_at: number,
) {
  const result = await safeRun(
    db,
    `UPDATE receipts
       SET image_uri = ?, purch_log_id = ?, created_at = ?
       WHERE id = ?`,
    [
			image_uri,
      purch_log_id,
      created_at
		]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM receipts WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM receipts WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

