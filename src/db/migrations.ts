// src/data/db/migrations.ts
import { SQLiteBindParams, SQLiteDatabase } from "expo-sqlite";
import { safeRun, safeExec } from "./utils";
import version_1_0_0 from "./__migrations__/version_1_0_0";
import version_1_0_1 from "./__migrations__/version_1_0_1";
import first_tables from "./__migrations__/version_1_0_0";
import addUsageToRecipeBatches from "./__migrations__/version_1_0_1";


async function deleteEverything(db: SQLiteDatabase) {
	await safeExec(db,
		`DROP TABLE IF EXISTS items;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS purchase_logs;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS usage_logs;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS recipes;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS recipe_batches;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS recipe_batch_inventory_logs;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS recipe_batch_usage_logs;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS cultures;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS sterilizations;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS inoculations;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS germinations;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS colonizations;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS contaminations;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS harvests;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS tasks;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS vendors;`
	)
	await safeExec(db,
		`DROP TABLE IF EXISTS brands;`
	)
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
	
  const DATABASE_VERSION: number = 10001

  const { user_version } = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );

//   const user_version = 0
	// deleteEverything(db)
	

  if (user_version >= DATABASE_VERSION) return;

  if (user_version < 10000) {
		const result = await 
			first_tables(
				db, 
				DATABASE_VERSION, 
			)
		if (DATABASE_VERSION === 10000) {
			const [Version, Tables] = result
			console.log("Database Version: ", Version)
			console.log("Tables: ", Tables)
		} else {
			console.log(result)
		}
  }

	if (DATABASE_VERSION >= 10001) {
		const result = await addUsageToRecipeBatches(
			db,
			DATABASE_VERSION,
		)
		if (DATABASE_VERSION === 10001) {
			const [Version, Tables] = result
			console.log("Database Version: ", Version)
			console.log("Tables: ", Tables)
		} else {
			console.log(result)
		}
	}
	


	// new tables here for immediate run; then move inside conditional
      
}
