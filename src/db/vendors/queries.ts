
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export type VendorType = {
		id: number;
		name: string;
		email: string;
		phone: string;
		address: string;
		contact_name: string;
		website: string;
		last_updated: number;
}

export async function create(
  db: SQLiteDatabase,
  name: string,
	email: string,
	phone: string,
	address: string,
	contact_name: string,
	website: string,
	last_updated: number
) {
  const result = await safeRun(db,
    "INSERT INTO vendors (name, email, phone, address, contact_name, website, last_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, email, phone, address, contact_name, website, last_updated]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll<VendorType>(db, "SELECT * FROM vendors ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
		name: string;
		email: string;
		phone: string;
		address: string;
		contact_name: string;
		website: string;
		last_updated: number;
  }>(db, "SELECT * FROM vendors WHERE id = ?", [id]);
}

export async function getByName(
  db: SQLiteDatabase,
  name: string
) {
  return await safeSelectOne<{
    id: number;
		name: string;
		email: string;
		phone: string;
		address: string;
		contact_name: string;
		website: string;
		last_updated: number;
  }>(db, "SELECT * FROM vendors WHERE name = ?", [name]);
}

export async function update(
  db: SQLiteDatabase,
  id: number,
	name: string,
	email: string,
	phone: string,
	address: string,
	contact_name: string,
	website: string,
	last_updated: number
) {
  const result = await safeRun(
    db,
    `UPDATE vendors
       SET item_id = ?, name = ?, email = ?, phone = ?, address = ?, contact_name = ?, website = ?, last_updated = ?
       WHERE id = ?`,
    [name, email, phone, address, contact_name, website, last_updated, id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM vendors WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM vendors WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

