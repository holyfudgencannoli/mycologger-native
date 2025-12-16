export interface RecipeBatchInventoryLog {
    id: number;
    item_id: number;
    amount_on_hand: number;
    inventory_unit: string;
    par: number;
    last_updated: number;
}