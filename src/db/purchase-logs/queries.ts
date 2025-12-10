
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelectAll, safeSelectOne } from "../utils";
import { PurchaseLogProp } from "@features/inventory/types/purchase-log";
import { PurchaseLogData, PurchaseLogType } from "./types";

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
  type: PurchaseLogType,
  item_id: number,
	created_at: number,
	purchase_date: number,
	purchase_unit: string,
	purchase_amount: number,
	inventory_unit: string,
	inventory_amount: number,
	vendor_id: number,
	brand_id: number,
	cost: number
) {
  const result = await safeRun(db,
    `INSERT INTO purchase_logs (item_id, created_at, purchase_date, purchase_unit, purchase_amount, inventory_unit, inventory_amount, vendor_id, brand_id, cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
			item_id, 
			created_at,
			purchase_date,
			purchase_unit,
			purchase_amount,
			inventory_unit,
			inventory_amount,
			vendor_id,
			brand_id,
			cost
		]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase, type: string) {
  return await safeExec(db, `SELECT * FROM purchase_logs ORDER BY id DESC`);
}


export async function getAllByType<PurchaseLogData>(db: SQLiteDatabase, type: string) {
  return await safeSelectAll<PurchaseLogData>(db, `SELECT * FROM purchase_logs WHERE type = ?`, [type]);
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
		vendor_id: number;
		brand_id: number;
		cost: number;
  }>(db, `SELECT * FROM purchase_logs WHERE id = ?`, [id]);
}


export async function getByItemId(
	db: SQLiteDatabase,
	type: PurchaseLogType,
	item_id: number
) {
	return await safeSelectAll<PurchaseLogData>(db, `SELECT * FROM purchase_logs WHERE item_id = ?`, [item_id]);
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
	vendor_id: number,
	brand_id: number,
	cost: number
) {
  const result = await safeRun(
    db,
    `UPDATE purchase_logs
       SET item_id = ?, created_at = ?, purchase_date = ?, purchase_unit = ?, purchase_amount = ?, inventory_unit = ?, inventory_amount = ?, vendor_id = ?, brand_id = ?, cost = ?
       WHERE id = ?`,
     [
			item_id, 
			created_at,
			purchase_date,
			purchase_unit,
			purchase_amount,
			inventory_unit,
			inventory_amount,
			vendor_id,
			brand_id,
			cost,
			id
		]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, type: string, id: number) {
  const result = await safeRun(
    db,
    `DELETE FROM purchase_logs WHERE id = ?`,
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
    `SELECT COUNT(*) AS count FROM purchase_logs WHERE id = ?`,
    [id]
  );

  return row?.count === 1;
}
