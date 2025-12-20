
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";
import { UsageLogType } from "./types";


const VALID_TYPES = new Set([
  "inventory_item",
  "raw_material",
  "bio_material",
  "consumable_item",
  "hardware_item",
  "recipe_batch"
  // add more as needed
]);
     
// export function usageLogTable(type: string) {
//   if (!VALID_TYPES.has(type)) {
//     throw new Error(`Invalid type: ${type}`);
//   }
//   if (type === 'recipe_batch') {
//     return `${type}_usage_logs`;
//   } else {
//     return 'usage_logs'
//   }
// }



export async function create(
    db: SQLiteDatabase,
    type: string,
    item_id: number,
    task_id: number,
    usage_amout: number,
    usage_unit: string,
    notes: string,
    last_updated: number,
) {
  const result = await safeRun(db,
    `INSERT INTO usage_logs (item_id, type, task_id, usage_amout, usage_unit, notes, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [item_id, type, task_id, usage_amout, usage_unit, notes, last_updated]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, `SELECT * FROM usage_logs ORDER BY id ASC`);
}

export async function getById(
    db: SQLiteDatabase,
    id: number,

) {
  return await safeSelectOne<{
    id: number;
    type: string;
    item_id: number,
    task_id: number,
    usage_amout: number,
    usage_unit: string,
    notes: string,
    last_updated: number,
  }>(db, `SELECT * FROM usage_logs WHERE id = ?`, [id]);
}

export async function getByItemId(
    db: SQLiteDatabase,
    item_id: number,

) {
  return await safeSelectAll<UsageLogType>(db, `SELECT * FROM usage_logs WHERE item_id = ?`, [item_id]);
}

export async function getByType(
    db: SQLiteDatabase,
    type: string,

) {
  return await safeSelectAll<{
    id: number;
    type: string;
    item_id: number,
    task_id: number,
    usage_amout: number,
    usage_unit: string,
    notes: string,
    last_updated: number,
  }>(db, `SELECT * FROM usage_logs WHERE type = ?`, [type]);
}


/**
 * Return all usage‑log rows that match both an item id and a type.
 *
 * @param db      The SQLite database instance (any wrapper you use).
 * @param itemId  The numeric ID of the item.
 * @param type    The string value of the “type” column (e.g. 'recipe batch').
 */
export async function getByItemIdAndType(
  db: SQLiteDatabase,
  itemId: number,
  type: string
) {
  const sql = `
    SELECT *
      FROM usage_logs
     WHERE item_id = ?
       AND type   = ?
  `;
  return await safeSelectAll<UsageLogType>(db, sql, [itemId, type]);
}


export async function update(
    db: SQLiteDatabase,
    type: string,
    item_id: number,
    task_id: number,
    usage_amout: number,
    usage_unit: string,
    notes: string,
    last_updated: number,
) {
  const result = await safeRun(
    db,
    `UPDATE usage_logs
       SET item_id = ?, type = ?, task_id = ?, usage_amout = ?, usage_unit = ?, notes = ?, last_updated = ?
       WHERE id = ?`,
    [item_id, type, task_id, usage_amout, usage_unit, notes, last_updated]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    `DELETE FROM usage_logs WHERE id = ?`,
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    `SELECT COUNT(*) as count FROM usage_logs WHERE id = ?`,
    [id]
  );

  return row?.count === 1;
}

