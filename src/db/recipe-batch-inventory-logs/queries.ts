
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { RecipeBatch } from "@db/recipe-batches/types";
import { qunit } from "globals";
import { RecipeBatchInventoryLog } from "./types";

export async function create(
    db: SQLiteDatabase,  
    item_id: number,
    amount_on_hand: number,
    inventory_unit: string,
    par: number,
    last_updated: number,
): Promise<number> {
  const result = await safeRun(db,
    "INSERT INTO recipe_batch_inventory_logs (item_id, amount_on_hand, inventory_unit, par, last_updated) VALUES (?, ?, ?, ?, ?)",
    [
                
        item_id,
        amount_on_hand,
        inventory_unit,
        par,
        last_updated,
    ]
  );

  return result.lastInsertRowId;
}

export async function readAll<RecipeBatchInventoryLog>(db: SQLiteDatabase) {
  return await safeSelectAll<RecipeBatchInventoryLog>(db, "SELECT * FROM recipe_batch_inventory_logs ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<RecipeBatchInventoryLog>(db, "SELECT * FROM recipe_batch_inventory_logs WHERE id = ?", [id]);
}

export async function getByBatchId(
  db: SQLiteDatabase,
  item_id: number
) {
  return await safeSelectOne<RecipeBatchInventoryLog>(db, "SELECT * FROM recipe_batch_inventory_logs WHERE item_id = ?", [item_id]);
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
  const query = `UPDATE recipe_batch_inventory_logs SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM recipe_batch_inventory_logs WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM recipe_batch_inventory_logs WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

