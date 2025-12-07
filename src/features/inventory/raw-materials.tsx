import { useState, useCallback } from "react";
import { Modal, Surface } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ScreenPrimative } from "@components/screen-primative";
import { RawMaterialsPurchaseLogModal } from "./detail-modal";
import { useSQLiteContext } from "expo-sqlite";
import * as RawMat from '@db/raw-materials';
import * as InvLog from '@db/inventory-logs';
import { LinearGradient } from "expo-linear-gradient";

export default function RawMaterialInventory() {
  const db = useSQLiteContext();
  const [rawMaterials, setRawMaterials] = useState([]);
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

  const getRMData = async () => {
    try {
      const rmData = await RawMat.readAll(db);
      setRawMaterials(rmData);

      const itemIds = rmData.map((d) => d.item_id);

      const cleanedLogs = [];

      for (let i = 0; i < itemIds.length; i++) {
        const id = itemIds[i];
        const rawRow = await InvLog.getByItemId(db, "raw_material", id);

        if (!rawRow) continue;

        // Flatten & sanitize DB row
        const cleaned = cleanRow(rawRow);
        cleanedLogs.push({
          ...cleaned,
          name: rmData[i].name,
          category: rmData[i].category,
          subcategory: rmData[i].subcategory
        });
      }

      setInventoryLogs(cleanedLogs);
    } catch (err) {
      console.error("Inventory loading error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRMData();
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

                  {modalOpen && (
                    <RawMaterialsPurchaseLogModal
                      visible={modalOpen}
                      setModalOpen={setModalOpen}
                      item={currentItem}
                    />
                  )}
                </>
              )}
            </Surface>
          </Surface>
        </LinearGradient>
      </View>
    </ScreenPrimative>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  surfaceContainer: {
    padding: 16,
    backgroundColor: "rgba(56,185,255,0.3)"
  },
  surfaceMetaContainer: {
    backgroundColor: "rgba(55,255,55,0.4)",
    width: 350
  }
});
