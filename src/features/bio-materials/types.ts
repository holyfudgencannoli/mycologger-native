import { iconTypes } from "@components/bottom-tabs";

export default interface BioMaterial {
    id: number;
    item_id: number;
    name: string;
    category: string;
    species_latin: string;
}


export const tabs: {name: string, icon: iconTypes}[] = [
    { name: "New Item", icon: "add-circle" },
    { name: "New Purchase Log", icon: "receipt" },
];