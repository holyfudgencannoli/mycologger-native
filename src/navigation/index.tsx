import { CommonActions, NavigationContainer, NavigationProp, StackActions, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigatorProps } from '@react-navigation/native-stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { createDrawerNavigator, DrawerNavigationProp } from "@react-navigation/drawer";
// import ExecuteBatch from "../AgarCultures/ExecuteBatch";
import { getHeaderTitle } from '@react-navigation/elements';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Items from '@features/items'
import * as Culture from '@features/cultures'
// import Login from "../Authentication/Login";
// // import LogoutScreen from "../../screens/HomeStack/LogoutScreen";
import { Dashboard } from "@features/dashboard";
import NewRecipe from "@features/recipes/new-recipe";
import RecipeList from "@features/recipes/recipe-list";
import RecipeBatchList from "@features/recipe-batches/recipe-batch-list";
import Header from "@components/header";
import TaskListScreen from "@features/tasks/task-list";
import NewTaskForm from "@features/tasks/new-task-form";
import ExecuteRecipeBatch from "@features/recipe-batches/execute-recipe-batch";
import CreateMaintenanceTask from "@features/tasks/new-maintenance-task";
import RawMaterialInventory from "@features/inventory/raw-materials";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import BioMaterialInventory from "@features/inventory/bio-materials";
import ConsumableItemInventory from "@features/inventory/consumable-items";
import HardwareItemInventory from "@features/inventory/hardware-items";
import { View, Platform } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { COLORS } from "@constants/colors";
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // change to your icon library
import { CultureParamList, InventoryItemParamList, RecipeParamList, RootDrawerParamsList, RootStackProps } from "@navigation/types";
import { StackScreenLifecycleState } from "react-native-screens";





const RootStack = createNativeStackNavigator<RootStackProps>();

function RootStackNavigator() {
    return(
        <RootStack.Navigator 
            id="root-stack" 
            screenOptions={{ headerShown: false, }}
        >
            <RootStack.Screen component={DrawerNavigator} name="RootStackDrawer"/>
        </RootStack.Navigator>
    )
}

export default function Navigation() {
    return(
        <NavigationContainer>
            <RootStackNavigator />
        </NavigationContainer>
    )
}

function MyTabBar({ state, descriptors, navigation }) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    
    <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.7, 1]}
        colors={['#0f0', '#08f', '#00f']}
        
        style={{ }}
    >
        <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
            }
            };

            const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
            };
    
            // Get the icon name from options
            const iconName =
            options.tabBarIconName || 'home'; // fallback icon if none provided


            return (
                    <PlatformPressable
                        key={index}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, padding: 8, height: 100, alignItems: 'center', backgroundColor: 'transparent' }}
                    >
                        <Ionicons
                            name={iconName}
                            size={24}
                            color={isFocused ? 'white' : '#ccc'}
                        />
                        <Text style={{ color: isFocused ? 'white' : '#ccc' }}>
                            {label}
                        </Text>
                    </PlatformPressable>
            );
        })}
        </View>
    </LinearGradient>
  );
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

                    return (
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#00f', '#94F8', '#f00']}
                            locations={[0, 0.5, 1]}
                        >
                    useRoute();        <Header navigation={navigation} title={title} style={options.headerStyle} textStyle={options.headerTitleStyle} />
                        </LinearGradient>
                    ) 
                },
                headerStyle: {
                    height: 'auto',         // ← Change header height
                    backgroundColor: '#6600ff55',
                    width: '100%'
                },
                headerTitleStyle: {
                    fontSize: 24,
                    padding: 8,
                    paddingLeft: 16,
                    textAlign: 'center',    
                    width: '100%',
                    color: 'white',
                    textShadowColor: 'black',
                    textShadowRadius: 8,
                    fontWeight: 'bold',
                    marginTop: '6%'
                },
                headerTintColor: 'white',
                drawerActiveTintColor: '#77a',
                // drawerInactiveBackgroundColor:'#fff',
                drawerInactiveTintColor: '#ccc',
                drawerHideStatusBarOnOpen: true,
                drawerStyle: {
                    backgroundColor: 'rgba(18, 203, 163, 0.9)'
                }
            }}
        >
            <Drawer.Screen component={Dashboard} name="Dashboard" />
            <Drawer.Screen component={RawMatStackNav} name='Raw Materials' options={{ popToTopOnBlur: true }} />
            <Drawer.Screen component={BioMaterialNavigator} name='Bio Materials' options={{ popToTopOnBlur: true }} />
            <Drawer.Screen component={ConsumablesNavigator} name='Consumable Items' options={{ popToTopOnBlur: true }} />
            <Drawer.Screen component={HardwareNavigator} name='Hardware Items' options={{ popToTopOnBlur: true }} />
            <Drawer.Screen component={ReceipesNavigator} name='Recipes' options={{ popToTopOnBlur: true }} />
            <Drawer.Screen component={CulturesNavigator} name='Cultures' options={{ popToTopOnBlur: true }} />
            {/* <Drawer.Screen component={DBManagement} name='DB Management'/> */}
            <Drawer.Screen component={InventoryNavigator} name='Inventory' options={{ popToTopOnBlur: true }} />
            {/* <Drawer.Screen component={ProductsNavGroup} name='Products'/>
            <Drawer.Screen component={TasksNavGroup} name='Tasks'/>
            <Drawer.Screen component={SterilizationRecordsNavGroup} name='Sterilizations'/> */}
            <Drawer.Screen component={TasksNavigator} name='Tasks' options={{ popToTopOnBlur: true }} />
            {/* <Drawer.Screen component={ImportExportNavigator} name='Import/Export'/> */}
            {/* <Drawer.Screen component={InventoryNavGroup} name='Inventory'/>
            <Drawer.Screen component={UtilitiesNavGroup} name='Utilities'/>
            <Drawer.Screen component={LogoutScreen} name='Logout'/> */}
        </Drawer.Navigator>
    )
}

const RawMatStack = createNativeStackNavigator()

function RawMatStackNav() {
    return(
        <RawMatStack.Navigator
            id="raw-mat-stack"
            screenOptions={{ headerShown: false }}
        >
            <RawMatStack.Screen name="New Item" component={Items.NewItem}  initialParams={{ msg: 'Hello World', msg2: 'Fuck yeah this is awesome'}}/>
            <RawMatStack.Screen name="New Purchase Log" component={Items.NewPurchaseLog} />
        </RawMatStack.Navigator>
    )
}

// const RawMaterial = createBottomTabNavigator<InventoryItemParamList, any>()

// function RawMaterialNavigator({ navigation }) {
//     useFocusEffect(
//         useCallback(() => {

//             return () => {
//                 // This runs when the screen loses focus (blur)
                
//             };
//         }, [navigation])
//     );

//     return(
//         <RawMaterial.Navigator 
            
//             tabBar={(props) => <MyTabBar {...props} />}
//             initialRouteName="New Item" 
//             screenOptions={{
//                 headerShown: false,
//                 // swipeEnabled: false,
//                 tabBarLabelStyle: { fontSize: 16, color: 'white' },
//                 // tabBarItemStyle: { borderColor: 'white', borderWidth: 1 },
//                 tabBarStyle: { backgroundColor: '#94f4' },

//             }}
//         >
//             <RawMaterial.Screen component={RawMat.NewItem} name="New Item"  />
//             <RawMaterial.Screen component={RawMat.NewPurchaseLog} name="New Purchase Log" />
//         </RawMaterial.Navigator>    
//     )
// }

const BioMaterial = createNativeStackNavigator<InventoryItemParamList, any>()

function BioMaterialNavigator() {
    return(
        <BioMaterial.Navigator
            id={'bio-mat-stack'}
            screenOptions={{
                headerShown: false
            }}
        >
            <BioMaterial.Screen component={Items.NewItem} name="New Item" initialParams={{ msg: 'Hello World', msg2: 'Fuck yeah this is awesome'}} />
            {/* <BioMaterial.Screen component={BioMat} name="Bio-Material List" /> */}
            <BioMaterial.Screen component={Items.NewPurchaseLog} name="New Purchase Log" />
        </BioMaterial.Navigator>
    )
}

const Consumables = createNativeStackNavigator<InventoryItemParamList, any>();

function ConsumablesNavigator () {
    return(
        <Consumables.Navigator
            id={'supply-stack'}
            screenOptions={{
                headerShown: false
            }}
        >
            <Consumables.Screen component={Items.NewItem} name="New Item" initialParams={{ msg: 'Hello World', msg2: 'Fuck yeah this is awesome'}}/>
            <Consumables.Screen component={Items.NewPurchaseLog} name="New Purchase Log"/>
        </Consumables.Navigator>
    )
}


const Hardware = createNativeStackNavigator<InventoryItemParamList, any>();

function HardwareNavigator () {
    return(
        <Hardware.Navigator
            id={'hardware-stack'}
            screenOptions={{
                headerShown: false
            }}
        >
            <Hardware.Screen component={Items.NewItem} name="New Item" initialParams={{ msg: 'Hello World', msg2: 'Fuck yeah this is awesome'}}/>
            <Hardware.Screen component={Items.NewPurchaseLog} name="New Purchase Log" />
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

const Recipes = createNativeStackNavigator<RecipeParamList, any>();

function ReceipesNavigator() {
    return(
        <Recipes.Navigator
            initialRouteName="Recipes"
            screenOptions={{
                headerShown: false
            }}
            id={'recipe-stack'}
        >
            <Recipes.Screen component={RecipeList} name="Recipes"/>
            <Recipes.Screen component={NewRecipe} name="New Recipe"/>
            <Recipes.Screen component={RecipeBatchList} name="Batches"/>
        </Recipes.Navigator>
    )
}

const Cultures = createNativeStackNavigator<CultureParamList, any>();

function CulturesNavigator() {
    return(
        <Cultures.Navigator
            screenOptions={{
                headerShown: false
            }}
            id={'culture-stack'}
        >
            <Cultures.Screen component={Culture.CultureList.default} name="Agar" />
            <Cultures.Screen component={Culture.CultureList.default} name="Liquid" />
            <Cultures.Screen component={Culture.CultureList.default} name="Spawn" />
        </Cultures.Navigator>
    )
}


export type InventoryParamList = {
  "Raw Materials": undefined;
  "Bio Materials": undefined;
  "Supplies": undefined;
  "Hardware": undefined;
};

const Inventory = createNativeStackNavigator<InventoryParamList, any>();

function InventoryNavigator() {
    return(
        <Inventory.Navigator
            id={'inventory-stack'}    
            screenOptions={{
                headerShown: false
            }}
        >
            <Inventory.Screen component={RawMaterialInventory} name="Raw Materials" />
            <Inventory.Screen component={BioMaterialInventory} name="Bio Materials" />
            <Inventory.Screen component={ConsumableItemInventory} name="Supplies" />
            <Inventory.Screen component={HardwareItemInventory} name="Hardware" />
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
        <Tasks.Navigator
            initialRouteName="Task List"
            id={'task-stack'}
            screenOptions={{
                headerShown: false
            }}
        >
            <Tasks.Screen component={TaskListScreen} name='Task List' options={{ headerShown: false }}/>
            <Tasks.Screen component={NewTaskForm} name='New Task' options={{ headerShown: false }}/>
            <Tasks.Screen component={Culture.Batch} name="New Agar Culture" options={{ headerShown: false }}/>
            <Tasks.Screen component={ExecuteRecipeBatch} name="New Batch From Recipe" options={{ headerShown: false }}/>
            <Tasks.Screen component={Culture.Batch} name="New Spawn Culture" options={{ headerShown: false }}/>
            <Tasks.Screen component={Culture.Batch} name="New Liquid Culture" options={{ headerShown: false }}/>
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