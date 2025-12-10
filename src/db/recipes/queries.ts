
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
	name: string,
	type: string,
	ingredients: object[],
	yield_amount: number,
	yield_unit: string,
    nute_concentration: number,
	created_at: number,
 
) {
  const result = await safeRun(db,
    "INSERT INTO recipes (name, type, ingredients, yield_amount, yield_unit, nute_concentration, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
			name,
			type,
			JSON.stringify(ingredients),
			yield_amount,
			yield_unit,
            nute_concentration,
			created_at,
		]
  );

  return result.lastInsertRowId;
}

export async function readAll<recipeProps>(db: SQLiteDatabase) {
  return await safeSelectAll<recipeProps>(db, "SELECT * FROM recipes ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    name: string,
		type: string,
		ingredients: string,
		yield_amount: number,
		yield_unit: string,
        nute_concentration: number,
		created_at: number,
  }>(db, "SELECT * FROM recipes WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<{
		id: number;
        name: string;
		type: string;
		ingredients: string;
		yield_amount: number;
		yield_unit: string;
        nute_concentration: number;
		created_at: number;
  }>(db, "SELECT * FROM recipes WHERE name = ?", [name]);
}

export async function update(
  db: SQLiteDatabase,
	name: string,
	type: string,
	ingredients: JSON,
	yield_amount: number,
	yield_unit: string,
    nute_concentration: number,
) {
  const result = await safeRun(
    db,
    `UPDATE recipes
       SET name = ?, type = ?, ingredients = ?, yield_amount = ?, yield_unit = ?, nute_concentration = ?
       WHERE id = ?`,
    [
			name,
			type,
			JSON.stringify(ingredients),
			yield_amount,
			yield_unit,
            nute_concentration
		]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM recipes WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM recipes WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

