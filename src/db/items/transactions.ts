import { safeRun } from "../utils";
import { SQLiteDatabase } from "expo-sqlite";

export async function newItem(
    db:SQLiteDatabase,
    type: string,
    created_at: number,
    name: string,
    category: string,
    subcategory: string,
    amount_on_hand: number,
    inventory_unit: string,
    last_updated:number,

) {
    
    try {
        await safeRun(db, "BEGIN TRANSACTION", []);

        const invItem = await safeRun(db,
            "INSERT INTO inventory_items (type, created_at) VALUES (?, ?)",
            [type, created_at]
        );

        const invItemId = invItem.lastInsertRowId;
        console.log(invItem)
        console.log(invItemId)

        const rawMat = await safeRun(db,
            "INSERT INTO raw_materials (item_id, name, category, subcategory) VALUES (?, ?, ?, ?)",
            [invItemId, name, category, subcategory]
        );

        const rawMatId = rawMat.lastInsertRowId;

        await safeRun(db,
            "INSERT INTO raw_material_inventory_logs (item_id, amount_on_hand, inventory_unit, last_updated) VALUES (?, ?, ?, ?)",
            [rawMatId, amount_on_hand, inventory_unit, last_updated]
        );

        await safeRun(db, "COMMIT", []);

        return { inventory_item_id: invItemId, raw_material_id: rawMat }
    } catch (err) {
        console.error("❌ Error creating new raw material:", err);

        try {
            await safeRun(db, "ROLLBACK", []);
        } catch (rollbackErr) {
            console.error("❌ ROLLBACK FAILED:", rollbackErr);
        }

        throw err;
    }
}   