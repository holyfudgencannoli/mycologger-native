export default interface InventoryLogType {
    id: number;
    item_id: number;
    amount_on_hand: number;
    inventory_unit: string;
    last_updated: number;
}