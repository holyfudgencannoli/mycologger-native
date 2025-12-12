
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create({
  db,
  type,
  recipe_batch_id,
  volume_amount,
  volume_unit,
  last_updated,
  sterilized_id,
  inoculated_id,
  germinated_id,
  colonized_id,
  contaminated_id,
  harvested_id,
  created_at,
} : {
  db: SQLiteDatabase,
  type: string,
  recipe_batch_id: number,
	volume_amount: number,
	volume_unit: string,
	last_updated: number,
	sterilized_id?: number,
	inoculated_id?: number,
	germinated_id?: number,
	colonized_id?: number,
	contaminated_id?: number,
	harvested_id?: number,
  created_at: number,

}) {
  const result = await safeRun(db,
    "INSERT INTO cultures (type, recipe_batch_id, volume_amount, volume_unit, last_updated, sterilized_id, inoculated_id, germinated_id, colonized_id, contaminated_id, harvested_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [type, recipe_batch_id, volume_amount, volume_unit, last_updated, sterilized_id, inoculated_id, germinated_id, colonized_id, contaminated_id, harvested_id, created_at]
  );

  return result.lastInsertRowId;
}

export async function readAll<CultureObject>(db: SQLiteDatabase) {
  return await safeSelectAll<CultureObject>(db, "SELECT * FROM cultures ORDER BY id ASC");
}

export async function readType(db: SQLiteDatabase, type: string) {
  return await safeSelect(db, `SELECT * FROM cultures WHERE type = ? ORDER BY id ASC`, [type]);

}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
  type: string,
  recipe_batch_id: number,
	volume_amount: number,
	volume_unit: string,
	last_updated: number,
	sterilized_id: number,
	inoculated_id: number,
	germinated_id: number,
	colonized_id: number,
	contaminated_id: number,
	harvested_id: number,
  created_at: number,

  }>(db, "SELECT * FROM cultures WHERE id = ?", [id]);
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
  const query = `UPDATE cultures SET ${setClauses.join(', ')} WHERE id = ?`;

  const result = await safeRun(db, query, values);
  return result.changes;
}


export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM cultures WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM cultures WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

