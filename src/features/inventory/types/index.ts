import { iconTypes } from '@components/bottom-tabs';

export * from './inventory-log'
export * from './purchase-log'
export * from './vendor'

export const tabs: {name: string, icon: iconTypes}[] = [
    { name: "Raw Materials", icon: "cube" },
    { name: "Bio Materials", icon: "egg" },
    { name: "Supplies", icon: "eyedrop" },
    { name: "Hardware", icon: "flask" },
];