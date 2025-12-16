import { useState, useCallback } from "react";
import { Modal, Surface } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ScreenPrimative } from "@components/screen-primative";
import { PurchaseLogsModal } from "./detail-modal";
import { useSQLiteContext } from "expo-sqlite";
import * as HW from '@db/items';
import { LinearGradient } from "expo-linear-gradient";
import HardwareItem from "@features/items/types";
import { ItemProps } from "@db/items/types";
import { MyTabBar } from "@components/bottom-tabs";
import { tabs } from "./types";
import * as Form from '@custom/react-native-forms/src'

export default function HardwareItemInventory({ navigation, state }) {
  const db = useSQLiteContext();
  const [hardwareItems, setHardwareItems] = useState([]);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const cleanRow = (row) => {
    if (!row) return null;

    const safeRow = {};

    for (const key of Object.keys(row)) {
      const val = row[key];

      if (val === undefined) safeRow[key] = null;
      else if (typeof val === "object") safeRow[key] = JSON.stringify(val);
      else safeRow[key] = val;
    }
    return safeRow;
  };

  const getItemData = async () => {
    try {
      const itemData: ItemProps[] = await HW.getAllByType(db, 'hardware_item');
      setHardwareItems(itemData);
      setInventoryLogs(itemData);

      const itemIds = itemData.map((d) => d.id);

      return itemIds
    } catch (err) {
      console.error("Inventory loading error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getItemData();
    }, [])
  );

  const columns = [
    { key: "name", title: "Item Name" },
    { key: "category", title: "Category" },
    { key: "amount_on_hand", title: "Amount On Hand", unit: "inventory_unit" }
  ];

  const openModal = (item) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  return (
    <ScreenPrimative edges={[]}>
      <View style={styles.container}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 0.9 }}
          colors={["#94F8", "#00f", "#057"]}
          style={{ flex: 1, padding: 16 }}
        >
          <Surface style={styles.surfaceMetaContainer}>
            <Surface style={styles.surfaceContainer}>
              <Form.Control name="table" label="Hardware" labelStyle={styles.label}>  
              
              {inventoryLogs.length > 0 && (
                <>
                  <ScrollableDataTable
                    data={inventoryLogs}
                    columns={columns}
                    headerTextStyle={{
                      textAlign: "center",
                      color: "rgba(255,255,255,0.7)",
                      textShadowColor: "blue",
                      textShadowRadius: 4
                    }}
                    cellTextStyle={{
                      textAlign: "center",
                      color: "white",
                      textShadowColor: "black",
                      textShadowRadius: 4
                    }}
                    headerStyle={{ backgroundColor: "rgba(255,55,55,0.7)" }}
                    onRowPress={openModal}
                  />

                </>
              )}
              </Form.Control>
            </Surface>
            {modalOpen && (
              <PurchaseLogsModal
                visible={modalOpen}
                setModalOpen={setModalOpen}
                item={currentItem}
              />
            )}
          </Surface>
        </LinearGradient>
      </View>
      <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs}/>
      
    </ScreenPrimative>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  surfaceContainer: {
    padding: 16,
    backgroundColor: "rgba(56,185,255,0.3)"
  },
  surfaceMetaContainer: {
    backgroundColor: "rgba(55,255,55,0.4)",
  },
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
});
