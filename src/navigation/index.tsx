import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createDrawerNavigator, DrawerNavigationProp } from "@react-navigation/drawer";
// import ExecuteBatch from "../AgarCultures/ExecuteBatch";
import { getHeaderTitle } from '@react-navigation/elements';

import * as RawMat from '@features/raw-materials'
import * as BioMat from '@features/bio-materials'
import * as ConItem from '@features/consumables'
import * as HW from '@features/hardware'
import * as Rec from '@features/recipes'
import * as Batches from '@features/recipe-batches'
import * as Agar from '@features/agar-cultures'
import * as Liquid from '@features/liquid-cultues'
import * as Spawn from '@features/spawn-cultures'


// import Login from "../Authentication/Login";
// // import LogoutScreen from "../../screens/HomeStack/LogoutScreen";
import { Dashboard } from "@features/dashboard";
import NewRecipe from "@features/recipes/new-recipe";
import RecipeList from "@features/recipes/recipe-list";
import RecipeBatchList from "@features/recipe-batches/recipe-batch-list";
import Header from "@components/header";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import TaskListScreen from "@features/tasks/task-list";
import NewTaskForm from "@features/tasks/new-task-form";
import DBManagement from "@features/db-management";
import ExecuteRecipeBatch from "@features/recipe-batches/execute-recipe-batch";
import CreateMaintenanceTask from "@features/tasks/new-maintenance-task";
import RawMaterialInventory from "@features/inventory/raw-materials";

// import RawMaterialList from '../RawMaterials/RawMaterialListScreen';
// import NewRMFormScreen from '../RawMaterials/NewRMFormScreen';
// import NewRMPurchaseLogScreen from '../RawMaterials/NewRMPurchaseLogScreen';
// import BioMaterialListScreen from "../BioMaterials/BioMaterialListScreen";
// import NewBioMatFormScreen from "../BioMaterials/NewBioMatFormScreen";
// import NewBioMatPurchaseLogScreen from "../BioMaterials/NewBioMatPurchaseLogScreen";
// import NewRecipeForm from "../Recipes/NewRecipeForm";
// import RecipeListScreen from "../Recipes/RecipeList";
// import ExcecuteAgarBatch from "../AgarCultures/ExecuteBatch";
// import NewTaskForm from "../Tasks/NewTaskForm";
// import ExecuteRecipeBatch from "../RecipeBatches/ExecuteRecipeBatch";
// import RecipeBatchListScreen from "../RecipeBatches/RecipeBatchList";
// import ImpExpDB from "../ImportExportDB";
// import RawMaterialInventory from "../Inventory/RawMaterialInventory";
// import CreateMaintenanceTask from "../Tasks/NewMaintenanceTask";
// import NewConsumableFormScreen from "../Consumables/NewConsumableItemFormScreen";
// import NewConsumablePurchaseLogScreen from "../Consumables/NewConsumableItemPurchaseLogScreen";
// import NewHardwareFormScreen from "../Hardware/NewHardwareItemFormScreen";
// import NewHardwarePurchaseLogScreen from "../Hardware/NewHardwareItemPurchaseLogScreen";
// import TaskListScreen from "../Tasks/TaskList";
// import Layout from "@features/Layout";

// // import RawMaterialPurchaseLogRecords from "./RawMaterialPurchaseLogRecords"
// // import SpecimenPurchaseLogRecords from "./SpecimenPurchaseLogRecords"

// // import PurchaseLogNavGroup from "../../screens/PurchaseLogStack/Navigation";
// // import PurchaseLogRecordsNavGroup from "../../screens/PurchaseLogRecordsStack/Navigation";
// // import TasksNavGroup from "./TaskDocumentationNavigation";
// // import FieldsNavGroup from './FieldDocumentationNavigation';
// // import ProductsNavGroup from './ProductDocumentationNavigation';
// // import InventoryNavGroup from './InventoryDocumentationNavigation';
// // import UtilitiesNavGroup from './UtitlitiesDocumentationNavigation';
// // import SterilizationRecordsNavGroup from "./SterilizationDocumentationNavigation";

// // import CreateBioMaterial from '../BioMaterial/CreateBioMaterial';
// // import BioMaterialList from '../BioMaterial/BioMaterialList';
// shattering
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


export type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>


export default function Navigation() {
    return(
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    )
}

// const Auth = createNativeStackNavigator();

// function AuthNavigator() {
//     return(
//         <Auth.Navigator>
//             <Auth.Screen component={Login} name='Login' options={{ headerShown: false }}/>
//             <Auth.Screen component={DrawerNavigator} name='Root' options={{ headerShown: false }} />
//         </Auth.Navigator>
//     )
// }

const Drawer = createDrawerNavigator<RootDrawerParamsList, any>()

function DrawerNavigator() {
    console.log("Root navigator mounted");

    return(
        <Drawer.Navigator 
            initialRouteName="Dashboard" 
            screenOptions={{
                header: ({ navigation, route, options }) => {
                    const title = getHeaderTitle(options, route.name);

                    return <Header navigation={navigation} title={title} style={options.headerStyle} textStyle={options.headerTitleStyle} />;
                },
                headerStyle: {
                    height: 50,         // ← Change header height
                    backgroundColor: '#6600ff55',
                    width: '100%',
                    borderColor: 'white',
                    borderWidth: 2,
                
                },
                headerTitleStyle: {
                    fontSize: 24,
                    padding: 8,
                    paddingLeft: 16,
                    color: 'white',
                    // lineHeight: 24,
                    fontWeight: 'bold',
                },
                headerTintColor: 'white',
            }}
        >
            <Drawer.Screen component={Dashboard} name="Dashboard"  />
            <Drawer.Screen component={RawMaterialNavigator} name='Raw Materials' />
            <Drawer.Screen component={BioMaterialNavigator} name='Bio Materials'/>
            <Drawer.Screen component={ConsumablesNavigator} name='Consumable Items'/>
            <Drawer.Screen component={HardwareNavigator} name='Hardware'/>
            <Drawer.Screen component={ReceipesNavigator} name='Recipes'/>
            <Drawer.Screen component={CulturesNavigator} name='Cultures'/>
            <Drawer.Screen component={DBManagement} name='DB Management'/>
            <Drawer.Screen component={InventoryNavigator} name='Inventory'/>
            {/* <Drawer.Screen component={ProductsNavGroup} name='Products'/>
            <Drawer.Screen component={TasksNavGroup} name='Tasks'/>
            <Drawer.Screen component={SterilizationRecordsNavGroup} name='Sterilizations'/> */}
            <Drawer.Screen component={TasksNavigator} name='Tasks'/>
            {/* <Drawer.Screen component={ImportExportNavigator} name='Import/Export'/> */}
            {/* <Drawer.Screen component={InventoryNavGroup} name='Inventory'/>
            <Drawer.Screen component={UtilitiesNavGroup} name='Utilities'/>
            <Drawer.Screen component={LogoutScreen} name='Logout'/> */}
        </Drawer.Navigator>
    )
}

const RawMaterial = createMaterialTopTabNavigator<InventoryItemParamList, any>()

function RawMaterialNavigator() {
    return(
        <RawMaterial.Navigator 
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <RawMaterial.Screen component={RawMat.NewItem} name="New Item" />
            <RawMaterial.Screen component={RawMat.NewPurchaseLog} name="New Purchase Log" />
        </RawMaterial.Navigator>    
    )
}

const BioMaterial = createMaterialTopTabNavigator<InventoryItemParamList, any>()

function BioMaterialNavigator() {
    return(
        <BioMaterial.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <BioMaterial.Screen component={BioMat.NewItem} name="New Item" />
            {/* <BioMaterial.Screen component={BioMat} name="Bio-Material List" /> */}
            <BioMaterial.Screen component={BioMat.NewPurchaseLog} name="New Purchase Log" />
        </BioMaterial.Navigator>
    )
}

const Consumables = createMaterialTopTabNavigator<InventoryItemParamList, any>();

function ConsumablesNavigator () {
    return(
        <Consumables.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <Consumables.Screen component={ConItem.NewItem} name="New Item"/>
            <Consumables.Screen component={ConItem.NewPurchaseLog} name="New Purchase Log"/>
        </Consumables.Navigator>
    )
}


const Hardware = createMaterialTopTabNavigator<InventoryItemParamList, any>();

function HardwareNavigator () {
    return(
        <Hardware.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <Hardware.Screen component={HW.NewItem} name="New Item"/>
            <Hardware.Screen component={HW.NewPurchaseLog} name="New Purchase Log"/>
        </Hardware.Navigator>
    )
}

// const PurchaseLogList = createMaterialTopTabNavigator()

// function PurchaseLogListNavigation() {
//     return(
//         <PurchaseLogList.Navigator>
//         {/*      <PurchaseLogList.Screen component={RawMaterialPurchaseLogRecords} name="Raw Material Purchase Logs" /> */}
//         {/*      <PurchaseLogList.Screen component={SpecimenPurchaseLogRecords} name="Specimen Purchase Logs" /> */}
//         </PurchaseLogList.Navigator>
//     )
// }

const Recipes = createMaterialTopTabNavigator<RecipeParamList, any>();

function ReceipesNavigator() {
    return(
        <Recipes.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <Recipes.Screen component={NewRecipe} name="New Recipe"/>
            <Recipes.Screen component={RecipeList} name="Recipes"/>
            <Recipes.Screen component={RecipeBatchList} name="Batches"/>
        </Recipes.Navigator>
    )
}

const Cultures = createMaterialTopTabNavigator<CultureParamList, any>();

function CulturesNavigator() {
    return(
        <Cultures.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <Cultures.Screen component={Agar.CultureList.default} name="Agar" />
            <Cultures.Screen component={Liquid.CultureList.default} name="Liquid" />
            <Cultures.Screen component={Spawn.CultureList.default} name="Spawn" />
        </Cultures.Navigator>
    )
}


export type InventoryParamList = {
  "Raw Materials": undefined;
};

const Inventory = createMaterialTopTabNavigator<InventoryParamList, any>();

function InventoryNavigator() {
    return(
        <Inventory.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 16, color: 'white' },
                // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
                tabBarStyle: { backgroundColor: '#94f8' },
            }}
        >
            <Inventory.Screen component={RawMaterialInventory} name="Raw Materials" />
            {/* <Inventory.Screen component={NewTaskForm} name="Bio Materials" /> */}
            {/* <Inventory.Screen component={NewTaskForm} name="Supplies" /> */}
            {/* <Inventory.Screen component={NewTaskForm} name="Hardware" /> */}
        </Inventory.Navigator>
    )
}


export type TaskParamList = {
  "New Task": undefined;
  "New Maintenance Task": undefined;
  "Task List": undefined;
  "New Agar Culture": {params: any[]};
  "New Liquid Culture": {params: any[]};
  "New Spawn Culture": {params: any[]};
  "New Batch From Recipe": undefined;
};

const Tasks = createNativeStackNavigator<TaskParamList, any>(); 

function TasksNavigator() {
    return(
        <Tasks.Navigator initialRouteName="Task List">
            <Tasks.Screen component={TaskListScreen} name='Task List' options={{ headerShown: false }}/>
            <Tasks.Screen component={NewTaskForm} name='New Task' options={{ headerShown: false }}/>
            <Tasks.Screen component={Agar.Batch} name="New Agar Culture" options={{ headerShown: false }}/>
            <Tasks.Screen component={ExecuteRecipeBatch} name="New Batch From Recipe" options={{ headerShown: false }}/>
            <Tasks.Screen component={Spawn.Batch} name="New Spawn Culture" options={{ headerShown: false }}/>
            <Tasks.Screen component={Liquid.Batch} name="New Liquid Culture" options={{ headerShown: false }}/>
            <Tasks.Screen component={CreateMaintenanceTask} name='New Maintenance Task' options={{ headerShown: false }}/>

        </Tasks.Navigator>
    )
}

// const ImportExport = createMaterialTopTabNavigator();

// function ImportExportNavigator() {
//     return(
//         <ImportExport.Navigator>
//             <ImportExport.Screen component={ImpExpDB} name="Export" />
//         </ImportExport.Navigator>
//     )
// }