
export interface recipeProps {
    id: number;
    name: string;
    type: string;
    ingredients: string;
    yield_amount: number;
    yield_unit: string;
    nute_concentration: number;
    created_at: number;
}


export interface ingredientProps {
    index?: string;
    ingredientName: string;
    ingredientId: number;
    amount: number;
    unit: string;
}
