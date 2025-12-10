
export type PurchaseLogType = 'raw_material' | 'bio_material' | 'consumable_item' | 'hardware_item'


export interface PurchaseLogData {
    id: number;
    item_id: number;
    type: PurchaseLogType;
    created_at: number;
    purchase_date: string;
    purchase_unit: string;
    purchase_amount: number;
    inventory_unit: string;
    inventory_amount: number;
    // receipt_entry_id: number;
    vendor_id: number;
    brand_id: number;
    cost: number;
}