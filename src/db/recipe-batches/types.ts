export default interface RecipeBatch {
    id: number;
    recipe_id: number,
    real_volume: number,
    real_volume_unit: string,
    real_weight: number,
    real_weight_unit: string,
    loss: number,
    name: string,
    notes: string,
    total_usage: number,
    usage_unit: string,
    created_at: number
}