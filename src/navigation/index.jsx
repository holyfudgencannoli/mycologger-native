import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { createDrawerNavigator } from "@react-navigation/drawer";
// import ExecuteBatch from "../AgarCultures/ExecuteBatch";


// import Login from "../Authentication/Login";
// // import LogoutScreen from "../../screens/HomeStack/LogoutScreen";
import { Dashboard } from "@features/dashboard";

// import RawMaterialList from '../RawMaterials/RawMaterialListScreen';
// import NewRMFormScreen from '../RawMaterials/NewRMFormScreen';
// import NewRMPurchaseLogScreen from '../RawMaterials/NewRMPurchaseLogScreen';
// import BioMaterialListScreen from "../BioMaterials/BioMaterialListScreen";
// import NewBioMatFormScreen from "../BioMaterials/NewBioMatFormScreen";
// import NewBioMatPurchaseLogScreen from "../BioMaterials/NewBioMatPurchaseLogScreen";
// import NewRecipeForm from "../Recipes/NewRecipeForm";
// import RecipeListScreen from "../Recipes/RecipeList";
// import ExcecuteAgarBatch from "../AgarCultures/ExecuteBatch";
// import * as Agar from '../AgarCultures'
// import * as Liquid from '../LiquidCultures'
// import * as Spawn from '../SpawnCultures'
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

const Drawer = createDrawerNavigator()

function DrawerNavigator() {
    console.log("Root navigator mounted");

    return(
        <Drawer.Navigator initialRouteName="Dashboard" screenOptions={{ unmountOnBlur: true, popToTopOnBlur: true,  }}>
            <Drawer.Screen component={Dashboard} name="Dashboard"  />
            {/* <Drawer.Screen component={RawMaterialNavigator} name='Raw Materials' /> */}
            {/* <Drawer.Screen component={BioMaterialNavigator} name='Bio Materials'/> */}
            {/* <Drawer.Screen component={ConsumablesNavigator} name='Consumables'/> */}
            {/* <Drawer.Screen component={HardwareNavigator} name='Hardware'/> */}
            {/* <Drawer.Screen component={ReceipesNavigator} name='Recipes'/> */}
            {/* <Drawer.Screen component={CulturesNavigator} name='Cultures'/> */}
            {/* <Drawer.Screen component={InventoryNavigator} name='Inventory' options={{ unmountOnBlur: true }}/> */}
            {/* <Drawer.Screen component={ProductsNavGroup} name='Products'/>
            <Drawer.Screen component={TasksNavGroup} name='Tasks'/>
            <Drawer.Screen component={SterilizationRecordsNavGroup} name='Sterilizations'/> */}
            {/* <Drawer.Screen component={TasksNavigator} name='Tasks'/> */}
            {/* <Drawer.Screen component={ImportExportNavigator} name='Import/Export'/> */}
            {/* <Drawer.Screen component={InventoryNavGroup} name='Inventory'/>
            <Drawer.Screen component={UtilitiesNavGroup} name='Utilities'/>
            <Drawer.Screen component={LogoutScreen} name='Logout'/> */}
        </Drawer.Navigator>
    )
}

// const RawMaterial = createMaterialTopTabNavigator()

// function RawMaterialNavigator() {
//     return(
//         <RawMaterial.Navigator screenLayout={Layout}>
//             <RawMaterial.Screen component={NewRMFormScreen} name="New Raw Material" />
//             <RawMaterial.Screen component={NewRMPurchaseLogScreen} name="New Purchase Log" />
//         </RawMaterial.Navigator>    
//     )
// }

// const BioMaterial = createMaterialTopTabNavigator()

// function BioMaterialNavigator() {
//     return(
//         <BioMaterial.Navigator>
//             <BioMaterial.Screen component={NewBioMatFormScreen} name="New Bio-Material" />
//             <BioMaterial.Screen component={BioMaterialListScreen} name="Bio-Material List" />
//             <BioMaterial.Screen component={NewBioMatPurchaseLogScreen} name="New Purchase Log" />
//         </BioMaterial.Navigator>
//     )
// }

// const Consumables = createMaterialTopTabNavigator();

// function ConsumablesNavigator () {
//     return(
//         <Consumables.Navigator>
//             <Consumables.Screen component={NewConsumableFormScreen} name="New Item"/>
//             <Consumables.Screen component={NewConsumablePurchaseLogScreen} name="New Purchase Log"/>
//         </Consumables.Navigator>
//     )
// }


// const Hardware = createMaterialTopTabNavigator();

// function HardwareNavigator () {
//     return(
//         <Hardware.Navigator>
//             <Hardware.Screen component={NewHardwareFormScreen} name="New Item"/>
//             <Hardware.Screen component={NewHardwarePurchaseLogScreen} name="New Purchase Log"/>
//         </Hardware.Navigator>
//     )
// }

// const PurchaseLogList = createMaterialTopTabNavigator()

// function PurchaseLogListNavigation() {
//     return(
//         <PurchaseLogList.Navigator>
//         {/*      <PurchaseLogList.Screen component={RawMaterialPurchaseLogRecords} name="Raw Material Purchase Logs" /> */}
//         {/*      <PurchaseLogList.Screen component={SpecimenPurchaseLogRecords} name="Specimen Purchase Logs" /> */}
//         </PurchaseLogList.Navigator>
//     )
// }

// const Recipes = createMaterialTopTabNavigator()

// function ReceipesNavigator() {
//     return(
//         <Recipes.Navigator screenOptions={{ unmountOnBlur: true }} >
//             <Recipes.Screen component={NewRecipeForm} name="New Recipe"/>
//             <Recipes.Screen component={RecipeListScreen} name="Recipes"/>
//             <Recipes.Screen component={RecipeBatchListScreen} name="Batches List"/>
//         </Recipes.Navigator>
//     )
// }

// const Cultures = createMaterialTopTabNavigator();

// function CulturesNavigator() {
//     return(
//         <Cultures.Navigator>
//             <Cultures.Screen component={Agar.CultureList.default} name="Agar" />
//             <Cultures.Screen component={Liquid.CultureList.default} name="Liquid" />
//             <Cultures.Screen component={Spawn.CultureList.default} name="Spawn" />
//         </Cultures.Navigator>
//     )
// }

// const Inventory = createMaterialTopTabNavigator();

// function InventoryNavigator() {
//     return(
//         <Inventory.Navigator>
//             <Inventory.Screen component={RawMaterialInventory} name="Raw Materials" options={{ unmountOnBlur: true }} />
//             <Inventory.Screen component={NewTaskForm} name="Bio Materials" />
//             <Inventory.Screen component={NewTaskForm} name="Supplies" />
//             <Inventory.Screen component={NewTaskForm} name="Hardware" />
//         </Inventory.Navigator>
//     )
// }

// const Tasks = createNativeStackNavigator(); 

// function TasksNavigator() {
//     return(
//         <Tasks.Navigator initialRouteName="Task List">
//             <Tasks.Screen component={TaskListScreen} name='Task List' options={{ headerShown: false }}/>
//             <Tasks.Screen component={NewTaskForm} name='New Task' options={{ headerShown: false }}/>
//             <Tasks.Screen component={Agar.Batch.default} name="New Agar Culture" options={{ headerShown: false }}/>
//             <Tasks.Screen component={ExecuteRecipeBatch} name="New Batch From Recipe" options={{ headerShown: false }}/>
//             <Tasks.Screen component={Spawn.Batch.default} name="New Spawn Culture" options={{ headerShown: false }}/>
//             <Tasks.Screen component={Liquid.Batch.default} name="New Liquid Culture" options={{ headerShown: false }}/>
//             <Tasks.Screen component={CreateMaintenanceTask} name='New Maintenance Task' options={{ headerShown: false }}/>

//         </Tasks.Navigator>
//     )
// }

// const ImportExport = createMaterialTopTabNavigator();

// function ImportExportNavigator() {
//     return(
//         <ImportExport.Navigator>
//             <ImportExport.Screen component={ImpExpDB} name="Export" />
//         </ImportExport.Navigator>
//     )
// }