
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelectOne } from "../utils";

const VALID_TYPES = new Set([
  "inventory_item",
  "raw_material",
  "bio_material",
  "consumable_item",
  "hardware_item",
  // add more as needed
]);

export function purchaseLogTable(type: string) {
  if (!VALID_TYPES.has(type)) {
    throw new Error(`Invalid type: ${type}`);
  }
  return `${type}_purchase_logs`;
}


export async function create(
  db: SQLiteDatabase,
  type: string,
  item_id: number,
	created_at: number,
	purchase_date: number,
	purchase_unit: string,
	purchase_amount: number,
	inventory_unit: string,
	inventory_amount: number,
	vendor: string,
	brand: string,
	cost: number
) {
  const result = await safeRun(db,
    `INSERT INTO ${purchaseLogTable(type)} (item_id, created_at, purchase_date, purchase_unit, purchase_amount, inventory_unit, inventory_amount, vendor, brand, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
			item_id, 
			created_at,
			purchase_date,
			purchase_unit,
			purchase_amount,
			inventory_unit,
			inventory_amount,
			vendor,
			brand,
			cost
		]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase, type: string) {
  return await safeExec(db, `SELECT * FROM ${purchaseLogTable(type)} ORDER BY id DESC`);
}

export async function getById(
  db: SQLiteDatabase,
	type: string,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    item_id: number;
		created_at: number;
		purchase_date: number;
		purchase_unit: string;
		purchase_amount: number;
		inventory_unit: string;
		inventory_amount: number;
		vendor: string;
		brand: string;
		cost: number;
  }>(db, `SELECT * FROM ${purchaseLogTable(type)} WHERE id = ?`, [id]);
}

export async function update(
  db: SQLiteDatabase,
	type: string,
	id: number,
	item_id: number,
	created_at: number,
	purchase_date: number,
	purchase_unit: string,
	purchase_amount: number,
	inventory_unit: string,
	inventory_amount: number,
	vendor: string,
	brand: string,
	cost: number
) {
  const result = await safeRun(
    db,
    `UPDATE ${purchaseLogTable(type)}
       SET item_id = ?, created_at = ?, purchase_date = ?, purchase_unit = ?, purchase_amount = ?, inventory_unit = ?, inventory_amount = ?, vendor = ?, brand = ?, cost = ?
       WHERE id = ?`,
     [
			item_id, 
			created_at,
			purchase_date,
			purchase_unit,
			purchase_amount,
			inventory_unit,
			inventory_amount,
			vendor,
			brand,
			cost,
			id
		]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, type: string, id: number) {
  const result = await safeRun(
    db,
    `DELETE FROM ${purchaseLogTable(type)} WHERE id = ?`,
    [id]
  );

  return result.changes; // rows deleted
}



export async function exists(
  db: SQLiteDatabase,
  type: string,
  id: number
) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    `SELECT COUNT(*) AS count FROM ${purchaseLogTable(type)} WHERE id = ?`,
    [id]
  );

  return row?.count === 1;
}
