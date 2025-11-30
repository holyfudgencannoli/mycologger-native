
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
  db: SQLiteDatabase,
    media_id: number,
    recipe_id: number,
    volume_amount: number,
    volume_unit: string,
    last_updated: number,
    sterilized_id: number,
    inoculated_id: number,
    germinated_id: number,
    colonized_id: number,
    contaminated_id: number,
    harvested_id: number
) {
  const result = await safeRun(db,
    "INSERT INTO liquid_cultures (media_id, recipe_id, volume_amount, volume_unit, last_updated, sterilized_id, inoculated_id, germinated_id, colonized_id, contaminated_id, harvested_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [media_id, recipe_id, volume_amount, volume_unit, last_updated, sterilized_id, inoculated_id, germinated_id, colonized_id, contaminated_id, harvested_id]
  );

  return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
  return await safeSelectAll(db, "SELECT * FROM liquid_cultures ORDER BY id ASC");
}

export async function getById(
  db: SQLiteDatabase,
  id: number
) {
  return await safeSelectOne<{
    id: number;
    media_id: number;
        recipe_id: number;
        volume_amount: number;
        volume_unit: string;
        last_updated: number;
        sterilized_id: number;
        inoculated_id: number;
        germinated_id: number;
        colonized_id: number;
        contaminated_id: number;
        harvested_id: number;
  }>(db, "SELECT * FROM liquid_cultures WHERE id = ?", [id]);
}

export async function update(
    db: SQLiteDatabase,
    media_id: number,
        recipe_id: number,
        volume_amount: number,
        volume_unit: string,
        last_updated: number,
        sterilized_id: number,
        inoculated_id: number,
        germinated_id: number,
        colonized_id: number,
        contaminated_id: number,
        harvested_id: number
) {
  const result = await safeRun(
    db,
    `UPDATE liquid_cultures
       SET media_id = ?, recipe_id = ?, volume_amount = ?, volume_unit = ?, last_updated = ?, sterilized_id = ?, inoculated_id = ?, germinated_id = ?, colonized_id = ?, contaminated_id = ?, harvested_id = ?
       WHERE id = ?`,
    [media_id, recipe_id, volume_amount, volume_unit, last_updated, sterilized_id, inoculated_id, germinated_id, colonized_id, contaminated_id, harvested_id]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM liquid_cultures WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM liquid_cultures WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

