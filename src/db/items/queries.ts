
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { Item } from "./types";

export async function create(
  db: SQLiteDatabase,
  name: string,
  category: string,
  subcategory: string,
  type: string,
  created_at: number,
  amount_on_hand: number,
  inventory_unit: string,
  par: number,
  last_updated: number,
  total_usage: number,
  usage_unit: string
) {
  const result = await safeRun(db,
    "INSERT INTO items (name, category, subcategory, type, created_at, amount_on_hand, inventory_unit, par, last_updated, total_usage, usage_unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [name, category, subcategory, type, created_at, amount_on_hand, inventory_unit, par, last_updated, total_usage, usage_unit]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll<Item>(db, "SELECT * FROM items ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<Item>(db, "SELECT * FROM items WHERE id = ?", [id]);
}

export async function getAllByType(
  db: SQLiteDatabase,
  type: string
) {
  return await safeSelectAll<Item>(db, "SELECT * FROM items WHERE type = ?", [type]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<Item>(db, "SELECT * FROM items WHERE name = ?", [name]);
}


export async function update(db: SQLiteDatabase, data: { id: number; [key: string]: any }) {
  const { id, ...fields } = data;

  const setClauses: string[] = [];
  const values: any[] = [];

  for (const key in fields) {
    if (fields[key] !== undefined) {
      setClauses.push(`${key} = ?`);
      values.push(fields[key]);
    }
  }

  if (setClauses.length === 0) return 0; // nothing to update

  values.push(id); // for WHERE clause
  const query = `UPDATE items SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}


export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM items WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM items WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

