
export type RootDrawerParamsList = {
    'Dashboard': undefined,
    'Raw Materials': undefined,
    'Bio Materials': {params: any[]},
    'Consumable Items': undefined,
    'Hardware': undefined,
    'Recipes': undefined, 
    'Cultures': undefined,
    'Tasks': {params: [{ startTime: any, endTime: any }]},
    'Inventory': undefined,
    'DB Management': undefined
}

export type InventoryItemParamList = {
  "New Item": undefined;
  "New Purchase Log": undefined;
};

export type RecipeParamList = {
  "New Recipe": undefined;
  "Recipes": undefined;
  "Batches": undefined;
};


export type CultureParamList = {
  "Agar": undefined;
  "Liquid": undefined;
  "Spawn": undefined;
};

type RMStackParamList = {
  'Raw Materials': undefined;
};


export type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>

export type RootStackProps = {
    "RootStackDrawer": undefined
}