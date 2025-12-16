import { safeExec } from "@db/utils";
import { SQLiteDatabase, SQLiteRunResult } from "expo-sqlite";

export async function createIndexes(db: SQLiteDatabase) {
  await safeExec(
    db,
    `CREATE INDEX IF NOT EXISTS idx_purchase_logs_type
    ON purchase_logs (type);`
  );

  await safeExec(
    db,
    `CREATE INDEX IF NOT EXISTS idx_purchase_logs_receipt_uri
    ON purchase_logs (receipt_uri);`
  );
}




export default async function first_tables(db: SQLiteDatabase, version: number): Promise<string[] | string> {  
  await safeExec(db, "PRAGMA journal_mode = 'wal';")
    
	await safeExec(db,
      `CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR,
        category VARCHAR,
        subcategory VARCHAR,
        type VARCHAR,
        created_at INTEGER NOT NULL,
        amount_on_hand REAL,
				inventory_unit STRING,
				par REAL,
				last_updated INTEGER NOT NULL,
				total_usage REAL,
				usage_unit STRING
      );`
    )

	// await safeExec(db, `CREATE INDEX IF NOT EXISTS idx_bio_material_purchase_logs_item_id ON bio_material_purchase_logs(item_id);`);
	// await safeExec(db, `CREATE INDEX IF NOT EXISTS idx_consumable_item_purchase_logs_item_id ON consumable_item_purchase_logs(item_id);`);
	// await safeExec(db, `CREATE INDEX IF NOT EXISTS idx_hardware_item_purchase_logs_item_id ON hardware_item_purchase_logs(item_id);`);


		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS purchase_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type STRING NOT NULL,
				item_id INTEGER NOT NULL,
				created_at INTEGER,
				purchase_date INTEGER NOT NULL,
				purchase_unit VARCHAR NOT NULL,
				purchase_amount FLOAT NOT NULL,
				inventory_unit VARCHAR,
				inventory_amount FLOAT,
				vendor_id INTEGER,
				brand_id INTEGER,
				receipt_uri STRING,
				cost FLOAT NOT NULL,
				FOREIGN KEY(item_id) REFERENCES items(id),
				FOREIGN KEY(vendor_id) REFERENCES vendors(id),
				FOREIGN KEY(brand_id) REFERENCES brands(id)
			)`
		)

		


		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type SRING NOT NULL,
				item_id INTEGER NOT NULL,
				task_id INTEGER NOT NULL,
				usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
				notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES items(id),
				FOREIGN KEY(task_id) REFERENCES tasks(id)
			)`
		)  


		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS recipes (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name VARCHAR NOT NULL,
				type VARCHAR NOT NULL,
				ingredients JSON NOT NULL,
				yield_amount INTEGER NOT NULL,
				yield_unit VARCHAR NOT NULL,
				nute_concentration REAL,
				created_at INTEGER NOT NULL
			)`
		)

		
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS recipe_batches (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				recipe_id INTEGER NOT NULL,
				real_volume REAL NOT NULL,
				real_volume_unit STRING NOT NULL,
				quantity REAL NOT NULL,
				real_weight REAL NOT NULL,
				real_weight_unit STRING NOT NULL,
				loss REAL NOT NULL,
				name STRING NOT NULL,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

        
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS recipe_batch_inventory_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				amount_on_hand REAL NOT NULL,
				inventory_unit FLOAT NOT NULL,
				par REAL,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES recipe_batches(id)
			)`
		)

		// await safeExec(db, 
		// 	`CREATE TABLE IF NOT EXISTS usage_logs (
		// 		id INTEGER PRIMARY KEY AUTOINCREMENT,
		// 		type SRING NOT NULL,
		// 		item_id INTEGER NOT NULL,
		// 		task_id INTEGER NOT NULL,
		// 		usage_amout REAL NOT NULL,
		// 		usage_unit FLOAT NOT NULL,
		// 		notes STRING,
		// 		last_updated INTEGER NOT NULL,
		// 		FOREIGN KEY(item_id) REFERENCES items(id),
		// 		FOREIGN KEY(task_id) REFERENCES tasks(id)
		// 	)`
		// )

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS recipe_batch_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				task_id INTEGER NOT NULL,
				usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
				inventory_before FLOAT NOT NULL,
				inventory_before_unit STRING,
				notes STRING,
				created_at INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES recipe_batches(id),
				FOREIGN KEY(task_id) REFERENCES tasks(id)
			)`
		)


		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS cultures (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type VARCHAR,
				created_at INTEGER NOT NULL,
				recipe_batch_id INTEGER NOT NULL,
				volume_amount REAL NOT NULL,
				volume_unit STRING NOT NULL,
				last_updated INTEGER NOT NULL,
				sterilized_id INTEGER,
				inoculated_id INTEGER,
				germinated_id INTEGER,
				colonized_id INTEGER,
				contaminated_id INTEGER,
				harvested_id INTEGER,
				FOREIGN KEY(recipe_batch_id) REFERENCES recipe_batches(id),
				FOREIGN KEY(sterilized_id) REFERENCES sterilizations(id),
				FOREIGN KEY(inoculated_id) REFERENCES inoculatations(id),
				FOREIGN KEY(germinated_id) REFERENCES germinatations(id),
				FOREIGN KEY(colonized_id) REFERENCES colonizations(id),
				FOREIGN KEY(contaminated_id) REFERENCES contaminatations(id),
				FOREIGN KEY(harvested_id) REFERENCES harvests(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS sterilizations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS inoculations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS germinations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS colonizations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS contaminations (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS harvests (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)
        
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS tasks (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name STRING NOT NULL,
				start INTEGER NOT NULL,
				end INTEGER NOT NULL,
				notes STRING
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS vendors (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name STRING NOT NULL,
				email STRING,
				phone STRING,
				address STRING,
				contact_name STRING,
				website STRING,
				last_updated STRING
			)`
		)

        
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS brands (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name STRING NOT NULL,
				website STRING, 
				last_updated STRING
			)`
		)
		createIndexes(db)

    // await safeExec(db, "PRAGMA foreign_keys = ON;");
    if (
      version === 10000
    ) {

      await safeExec(db, `PRAGMA user_version = ${version}`);

      const tables: any = db.getAllAsync(
        `SELECT name FROM sqlite_master WHERE type='table';`
      );

      const Version = `App Version === ${version}`
      const Tables = `Tables in DB:, ${await tables.map(t => t.name)}`
      
      return [Version, Tables]
    } else {
      return `➡️ Continuing Migration to Version ${version}`
    }
    


  
}