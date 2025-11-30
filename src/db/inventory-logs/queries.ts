import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelectOne } from "../utils";

const VALID_TYPES = new Set([
  "inventory_item",
  "raw_material",
  "bio_material",
  "consumable_item",
  "hardware_item",
  "recipe_batch"
  // add more as needed
]);

export function inventoryLogTable(type: string) {
  if (!VALID_TYPES.has(type)) {
    throw new Error(`Invalid type: ${type}`);
  }
  return `${type}_inventory_logs`;
}


export async function create(
    db: SQLiteDatabase,
    type: string,
    item_id: number,
	amount_on_hand: number,
	inventory_unit: string,
	last_updated: number
) {
  const result = await safeRun(db,
    `INSERT INTO ${inventoryLogTable(type)} (item_id, amount_on_hand, inventory_unit, last_updated) VALUES (?, ?, ?, ?)`,
    [
			item_id, 
			amount_on_hand,
			inventory_unit,
			last_updated,
		]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase, type: string) {
  return await safeExec(db, `SELECT * FROM ${inventoryLogTable
(type)} ORDER BY id DESC`);
}

export async function getByItemId(
    db: SQLiteDatabase,
	type: string,
    item_id: number
) {
    return await safeSelectOne<{
        id: number;
        item_id: number;
		amount_on_hand: number;
		inventory_unit: string;
		last_updated: number;
    }>(db, `SELECT * FROM ${inventoryLogTable(type)} WHERE item_id = ?`, [item_id]);
}

export async function update(
  db: SQLiteDatabase,
	type: string,
	id: number,
	item_id: number,
	amount_on_hand: number,
	inventory_unit: string,
	last_updated: number,
) {
  const result = await safeRun(
    db,
    `UPDATE ${inventoryLogTable(type)}
       SET amount_on_hand = ?, inventory_unit = ?, last_updated = ?
       WHERE item_id = ?`,
     [
			item_id, 
			amount_on_hand,
			inventory_unit,
			last_updated,
			id
		]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, type: string, id: number) {
  const result = await safeRun(
    db,
    `DELETE FROM ${inventoryLogTable
(type)} WHERE id = ?`,
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
    `SELECT COUNT(*) AS count FROM ${inventoryLogTable
(type)} WHERE id = ?`,
    [id]
  );

  return row?.count === 1;
}
