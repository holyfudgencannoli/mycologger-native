import { safeExec } from "@db/utils";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export default async function addUsageToRecipeBatches(db: SQLiteDatabase, version: number): Promise<string[] | string> {
 await safeExec(
  db, 
  `ALTER TABLE recipe_batches
   ADD COLUMN total_usage FLOAT;`  
  ) 
  await safeExec(
    db, 
    `ALTER TABLE recipe_batches
    ADD COLUMN usage_unit STRING;`  
  ) 

  if (
      version === 10001
    ) {
    await safeExec(db, `PRAGMA user_version = ${version}`);

    const tables: any = await db.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table';`
    );

    const Version = `User Version === ${version}`
    const TableObjects = await tables.map(t => `\n ${t.name}`)
    const Tables = `Tables in DB: \n ${TableObjects}`

    return [Version, Tables]

  } else {
    return `➡️ Continuing Migration to Version ${version}`
  }

}			