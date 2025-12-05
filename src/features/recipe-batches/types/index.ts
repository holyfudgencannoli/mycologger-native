export interface RecipeBatch {
    id: number;
    recipe_id: number,
    quantity: number,
    real_amount: number,
    real_unit: string,
    loss: number,
    name: string,
    notes: string,
    created_at: number
}