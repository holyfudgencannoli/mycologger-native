// src/data/db/migrations.ts
import { SQLiteBindParams, SQLiteDatabase } from "expo-sqlite";
import { safeRun, safeExec } from "./utils";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1.03;
  
  // await safeExec(db, `DROP TABLE IF EXISTS inventory_items;`)
  // await safeExec(db, `DROP TABLE IF EXISTS raw_materials`)
  // await safeExec(db, `DROP TABLE IF EXISTS raw_material_inventory_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS raw_material_purchase_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS bio_materials`)
  // await safeExec(db, `DROP TABLE IF EXISTS bio_material_inventory_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS bio_material_purchase_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS bio_materials`)
  // await safeExec(db, `DROP TABLE IF EXISTS hardware_items`)
  // await safeExec(db, `DROP TABLE IF EXISTS consumable_items`)
  // await safeExec(db, `DROP TABLE IF EXISTS consumable_item_purchase_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS consumable_items`)
  // await safeExec(db, `DROP TABLE IF EXISTS consumable_item_inventory_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS consumable_item_purchase_logs`)
  // await safeExec(db, `DROP TABLE IF EXISTS recipes`)
	// await safeExec(db, `DROP TABLE IF EXISTS culture_media`)
	// await safeExec(db, `DROP TABLE IF EXISTS agar_culture`)
	// await safeExec(db, `DROP TABLE IF EXISTS liquid_culture`)
	// await safeExec(db, `DROP TABLE IF EXISTS spawn_culture`)
	// await safeExec(db, `DROP TABLE IF EXISTS sterilizations`)
	// await safeExec(db, `DROP TABLE IF EXISTS inoculations`)
	// await safeExec(db, `DROP TABLE IF EXISTS germinations`)
	// await safeExec(db, `DROP TABLE IF EXISTS colonizations`)
	// await safeExec(db, `DROP TABLE IF EXISTS contaminations`)
	// await safeExec(db, `DROP TABLE IF EXISTS harvests`)

  const { user_version } = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );

//   const user_version = 0

  if (user_version >= DATABASE_VERSION) return;

  if (user_version === 0) {
    await safeExec(db, "PRAGMA journal_mode = 'wal';")
    
		await safeExec(db,
      `CREATE TABLE IF NOT EXISTS inventory_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type VARCHAR,
        created_at INTEGER
      )`
    )

    await safeExec(db, 
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(1024) NOT NULL,
        password_hash VARCHAR NOT NULL,
        is_admin BOOLEAN,
        email VARCHAR,
        phone VARCHAR,
        provider VARCHAR,
        provider_id INTEGER,
        created_at INTEGER,
        last_login INTEGER,
        UNIQUE (username)
      )`
    )

    await safeExec(db,
      `CREATE TABLE IF NOT EXISTS raw_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        name VARCHAR,
        category VARCHAR,
        subcategory VARCHAR,
        FOREIGN KEY(item_id) REFERENCES inventory_items(id)
      )`
    )

    await safeExec(db,     
      `CREATE TABLE IF NOT EXISTS bio_materials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        name VARCHAR,
        category VARCHAR,
        volume REAL,
        volume_unit STRING,
        species_latin VARCHAR,
        FOREIGN KEY(item_id) REFERENCES inventory_items(id)
      )`
    )

    await safeExec(db, 
        `CREATE TABLE IF NOT EXISTS consumable_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            name VARCHAR,
            category VARCHAR,
            subcategory VARCHAR,
            FOREIGN KEY(item_id) REFERENCES inventory_items (id)
        )`  
    )

    await safeExec(db, 
        `CREATE TABLE IF NOT EXISTS hardware_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            name VARCHAR,
            category VARCHAR,
            subcategory VARCHAR,
            FOREIGN KEY(item_id) REFERENCES inventory_items (id)
        )`
    )

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS bio_material_purchase_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				created_at INTEGER,
				purchase_date INTEGER NOT NULL,
				purchase_unit VARCHAR NOT NULL,
				purchase_amount FLOAT NOT NULL,
				inventory_unit VARCHAR,
				inventory_amount FLOAT,
				vendor_id INTEGER,
				brand_id INTEGER,
				cost FLOAT NOT NULL,
				FOREIGN KEY(item_id) REFERENCES bio_materials(id),
				FOREIGN KEY(vendor_id) REFERENCES vendors(id),
				FOREIGN KEY(brand_id) REFERENCES brands(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS raw_material_purchase_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				created_at INTEGER NOT NULL,
				purchase_date INTEGER NOT NULL,
				purchase_unit VARCHAR NOT NULL,
				purchase_amount FLOAT NOT NULL,
				inventory_unit VARCHAR NOT NULL,
				inventory_amount FLOAT NOT NULL,
				vendor_id INTEGER,
				brand_id INTEGER,
				cost FLOAT NOT NULL,
				FOREIGN KEY(item_id) REFERENCES raw_materials(id),
				FOREIGN KEY(vendor_id) REFERENCES vendors(id),
				FOREIGN KEY(brand_id) REFERENCES brands(id)
			)`
		)
		
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS hardware_item_purchase_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				created_at INTEGER NOT NULL,
				purchase_date INTEGER NOT NULL,
				purchase_unit VARCHAR NOT NULL,
				purchase_amount FLOAT NOT NULL,
				inventory_unit VARCHAR,
				inventory_amount FLOAT,
				vendor_id INTEGER,
				brand_id INTEGER,
				cost FLOAT NOT NULL,
				FOREIGN KEY(item_id) REFERENCES hardware_items(id),
				FOREIGN KEY(vendor_id) REFERENCES vendors(id),
				FOREIGN KEY(brand_id) REFERENCES brands(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS consumable_item_purchase_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				created_at INTEGER NOT NULL,
				purchase_date INTEGER NOT NULL,
				purchase_unit VARCHAR NOT NULL,
				purchase_amount FLOAT NOT NULL,
				inventory_unit VARCHAR,
				inventory_amount FLOAT,
				vendor_id INTEGER,
				brand_id INTEGER,
				cost FLOAT NOT NULL,
				FOREIGN KEY(item_id) REFERENCES consumable_items(id),
				FOREIGN KEY(vendor_id) REFERENCES vendors(id),
				FOREIGN KEY(brand_id) REFERENCES brands(id)
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

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS bio_material_inventory_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                amount_on_hand REAL NOT NULL,
				inventory_unit FLOAT NOT NULL,
                par REAL,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES bio_materials(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS raw_material_inventory_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
				amount_on_hand FLOAT NOT NULL,
				inventory_unit STRING NOT NULL,
                par REAL,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES raw_materials(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS hardware_item_inventory_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                amount_on_hand REAL NOT NULL,
				inventory_unit FLOAT NOT NULL,
                par REAL,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES hardware_items(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS consumable_item_inventory_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                amount_on_hand REAL NOT NULL,
				inventory_unit FLOAT NOT NULL,
                par REAL,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES consumable_items(id)
			)`
		)

        await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS bio_material_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
                notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES bio_materials(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS raw_material_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
                notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES raw_materials(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS hardware_item_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
                notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES hardware_items(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS consumable_item_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
                notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES consumable_items(id)
			)`
		)

        await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS recipe_batch_usage_logs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				item_id INTEGER NOT NULL,
                task_id INTEGER NOT NULL,
                usage_amout REAL NOT NULL,
				usage_unit FLOAT NOT NULL,
                notes STRING,
				last_updated INTEGER NOT NULL,
				FOREIGN KEY(item_id) REFERENCES recipe_batches(id)
			)`
		)

		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS culture_media (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type VARCHAR,
				created_at INTEGER NOT NULL
			)`
		)
		
		await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS agar_cultures (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				media_id INTEGER NOT NULL,
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
				FOREIGN KEY(media_id) REFERENCES culture_media(id),
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
			`CREATE TABLE IF NOT EXISTS liquid_cultures (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				media_id INTEGER NOT NULL,
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
				FOREIGN KEY(media_id) REFERENCES culture_media(id),
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
			`CREATE TABLE IF NOT EXISTS spawn_cultures (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				media_id INTEGER NOT NULL,
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
				FOREIGN KEY(media_id) REFERENCES culture_media(id),
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
			`CREATE TABLE IF NOT EXISTS recipe_batches (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				recipe_id INTEGER NOT NULL,
				quantity REAL NOT NULL,
				real_amount REAL NOT NULL,
				real_unit REAL NOT NULL,
                loss REAL NOT NULL,
				name STRING NOT NULL,
				notes STRING,
				created_at INTEGER NOT NULL
			)`
		)
~
        await safeExec(db, 
			`CREATE TABLE IF NOT EXISTS vendors (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name STRING NOT NULL,
				email STRING,
				phone STRING,
                address STRING,
                contact_name STRING,
                website STRING
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
	
    // await safeExec(db, "PRAGMA foreign_keys = ON;");

    await safeExec(db, `PRAGMA user_version = ${DATABASE_VERSION}`);

    const tables: any = await db.getAllAsync(
      `SELECT name FROM sqlite_master WHERE type='table';`
    );

    console.log("Tables in DB:", tables.map(t => t.name));

  }
  
  

	// new tables here for immediate run; then move inside conditional
      
}
