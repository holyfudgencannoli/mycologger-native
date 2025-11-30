
import { SQLiteDatabase } from "expo-sqlite";
import { safeExec, safeRun, safeSelect, safeSelectOne, safeSelectAll } from "../utils";

export async function create(
    db: SQLiteDatabase,
    name: string,
    start: number,
    end: number,
    notes: string
   
 
) {
    const result = await safeRun(db,
        "INSERT INTO tasks (name, start, end, notes) VALUES (?, ?, ?, ?)",
            [
                name,
                start,
                end,
                notes
            ]
    );

    return result.lastInsertRowId;
}

export async function readAll(db: SQLiteDatabase) {
    return await safeSelectAll(db, "SELECT * FROM tasks ORDER BY id ASC");
}

export async function getById(
    db: SQLiteDatabase,
    id: number
) {
    return await safeSelectOne<{
        id: number;
        name: string,
        start: number,
        end: number,
        notes: string
  }>(db, "SELECT * FROM tasks WHERE id = ?", [id]);
}

export async function getByName(
    db: SQLiteDatabase,
    name: string
) {
    return await safeSelectOne<{
        id: number;
        name: string,
        start: number,
        end: number,
        notes: string
  }>(db, "SELECT * FROM tasks WHERE name = ?", [name]);
}

export async function update(
    db: SQLiteDatabase,
    name: string,
    start: number,
    end: number,
    notes: string
) {
  const result = await safeRun(
    db,
    `UPDATE tasks
       SET name = ?, start = ?, send = ?, notes = ?
       WHERE id = ?`,
    [
            name,
            start,
            end,
            notes
        ]
  );

  return result.changes; // number of rows updated
}

export async function destroy(db: SQLiteDatabase, id: number) {
  const result = await safeRun(
    db,
    "DELETE FROM tasks WHERE id = ?",
    [id]
  );

  return result.changes; // rows deleted
}

export async function exists(db: SQLiteDatabase, id: number) {
  const row = await safeSelectOne<{ count: number }>(
    db,
    "SELECT COUNT(*) as count FROM tasks WHERE id = ?",
    [id]
  );

  return row?.count === 1;
}

