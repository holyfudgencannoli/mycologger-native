
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { RecipeBatch } from "@db/recipe-batches/types";
import { qunit } from "globals";

export async function create(
    db: SQLiteDatabase,  
    quantity: number,
	  recipe_id: number,
    real_volume: number,
    real_volume_unit: string,
    real_weight: number,
    real_weight_unit: string,
    loss: number,
    name: string,
    notes: string,
    created_at: number
) {
  const result = await safeRun(db,
    "INSERT INTO recipe_batches (recipe_id, quantity, real_volume, real_volume_unit, real_weight, real_weight_unit, loss, name, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
                
      recipe_id,
      quantity,
      real_volume,
      real_volume_unit,
      real_weight,
      real_weight_unit,
      loss,
      name,
      notes,
      created_at,
    ]
  );

  return result.lastInsertRowId;
}

export async function readAll<RecipeBatch>(db: SQLiteDatabase) {
  return await safeSelectAll<RecipeBatch>(db, "SELECT * FROM recipe_batches ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<RecipeBatch>(db, "SELECT * FROM recipe_batches WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<RecipeBatch>(db, "SELECT * FROM recipe_batches WHERE name = ?", [name]);
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
  const query = `UPDATE recipe_batches SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}


export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM recipe_batches WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM recipe_batches WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

