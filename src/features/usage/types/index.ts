export * from './inventory-log'
export * from './purchase-log'
export * from './vendor'

import { iconTypes } from "@components/bottom-tabs";

export const tabs: {name: string, icon: iconTypes}[] = [
    { name: "Raw Materials", icon: "square" },
    { name: "Bio Materials", icon: "egg" },
    { name: "Recipe Batches", icon: "book" },
    { name: "Supplies", icon: "eyedrop" },
];