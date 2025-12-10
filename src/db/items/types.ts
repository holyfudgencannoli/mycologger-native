export interface Item {
    id: number;
    name: string;
    category: string;
    subcategory: string;
    type: string;
    created_at: number;
    amount_on_hand: number;
    inventory_unit: string;
    par: number;
    last_updated: number;
    total_usage: number;
    usage_unit: string;		
}

export interface ItemProps {
    id?: number;
    name?: string;
    category?: string;
    subcategory?: string;
    type?: string;
    created_at?: number;
    amount_on_hand?: number;
    inventory_unit?: string;
    par?: number;
    last_updated?: number;
    total_usage?: number;
    usage_unit?: string;		
}