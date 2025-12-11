
export interface ReceiptProps {
    id: number
    image_uri: string,
    purch_log_id: number,
    created_at: number,
}


export interface ingredientProps {
    ingredientName: string;
    ingredientId: number;
    amount: number;
    unit: string;
}
