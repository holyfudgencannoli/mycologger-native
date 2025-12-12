import { iconTypes } from "@components/bottom-tabs";

export interface LiquidCulture {
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



export const tabs: {name: string, icon: iconTypes}[] = [
    { name: "Agar", icon: "square" },
    { name: "Liquid", icon: "water" },
    { name: "Spawn", icon: "triangle" },
];