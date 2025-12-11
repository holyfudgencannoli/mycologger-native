import { iconTypes } from '@components/bottom-tabs';

export * from './inventory-log'
export * from './purchase-log'
export * from './vendor'

export const tabs: {name: string, icon: iconTypes}[] = [
    { name: "New Item", icon: "add-circle" },
    { name: "New Purchase Log", icon: "receipt" },
];