export interface AgarCulture {
    id: number;
    media_id: number;
    recipe_batch_id: number;
    volume_amount: number;
    volume_unit: string;
    last_updated: number;
    sterilized_id: number;
    inoculated_id: number;
    germinated_id: number;
    colonized_id: number;
    contaminated_id: number;
    harvested_id: number;
}