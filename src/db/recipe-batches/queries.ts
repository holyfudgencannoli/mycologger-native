
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { RecipeBatch } from "@features/recipe-batches/types";

export async function create(
    db: SQLiteDatabase,
    recipe_id: number,
    quantity: number,
    real_amount: number,
    real_unit: string,
    loss: number,
    name: string,
    notes: string,
    created_at: number
) {
  const result = await safeRun(db,
    "INSERT INTO recipe_batches ( recipe_id, quantity, real_amount, real_unit, loss, name, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
        recipe_id,
        quantity,
        real_amount,
        real_unit,
        loss,
        name,
        notes,
        created_at
    ]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll<RecipeBatch>(db, "SELECT * FROM recipe_batches ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    recipe_id: number,
    quantity: number,
    real_amount: number,
    real_unit: string,
    loss: number,
    name: string,
    notes: string,
    created_at: number
  }>(db, "SELECT * FROM recipe_batches WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<{
		id: number;
        recipe_id: number;
        quantity: number;
        real_amount: number;
        real_unit: string;
        loss: number;
        name: string;
        notes: string;
        created_at: number;
  }>(db, "SELECT * FROM recipe_batches WHERE name = ?", [name]);
}

export async function update(
    db: SQLiteDatabase,
	  recipe_id: number,
    quantity: number,
    real_amount: number,
    real_unit: string,
    loss: number,
    name: string,
    notes: string,
    created_at: number
) {
  const result = await safeRun(
    db,
    `UPDATE recipe_batches
       SET name = ?, type = ?, ingredients = ?, yield_amount = ?, yield_unit = ?, nute_concentration = ?
       WHERE id = ?`,
        [
            recipe_id,
            quantity,
            real_amount,
            real_unit,
            loss,
            name,
            notes,
            created_at
		]
  );

  return result.changes; // number of rows updated
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

