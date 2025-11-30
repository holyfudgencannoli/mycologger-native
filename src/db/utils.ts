import { SQLiteDatabase, SQLiteBindParams, SQLiteRunResult } from "expo-sqlite";

export async function safeExec(db: SQLiteDatabase, query: string) {
  try {
    console.log("Running query:", query);
    await db.execAsync(query);
    console.log("✅ Success");
  } catch (err) {
    console.error("❌ Error running query:", query, err);
    throw err; // optional, to stop further migration
  }
}

export async function safeRun(db: SQLiteDatabase, query: string, params: SQLiteBindParams) {
  try {
    console.log("Running query:", query);
    const result = await db.runAsync(query, params);
    console.log("✅ Success");
    return result
  } catch (err) {
    console.error("❌ Error running query:", query, err);
    throw err; // optional, to stop further migration
  }
}

export async function safeSelect<T>(
  db: SQLiteDatabase,
  sql: string,
  params: SQLiteBindParams
): Promise<T[]> {
  try {
    console.log("➡️ SELECT:", sql, params);
    return await db.getAllAsync<T>(sql, params);
  } catch (e) {
    console.error("❌ SELECT ERROR:", sql, params, e);
    throw e;
  }
}

export async function safeSelectOne<T>(
  db: SQLiteDatabase,
  sql: string,
  params: SQLiteBindParams
): Promise<T | null> {
  const rows = await safeSelect<T>(db, sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function safeSelectAll<T>(db: SQLiteDatabase, query: string, params: any[] = []) {
  try {
    console.log("Running query:", query, params);
    const rows = await db.getAllAsync<T>(query, params);
    console.log("✅ SELECT success");
    return rows;
  } catch (err) {
    console.error("❌ SELECT error:", query, params, err);
    throw err;
  }
}
