import { useState, useCallback } from "react";
import { Modal, Surface } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ScreenPrimative } from "@components/screen-primative";
import { PurchaseLogsModal } from "./detail-modal";
import { useSQLiteContext } from "expo-sqlite";
import * as BioMat from '@db/bio-materials';
import * as InvLog from '@db/inventory-logs';
import { LinearGradient } from "expo-linear-gradient";
import BioMaterial from "@features/bio-materials/types";
import { PurchaseLogProp } from "./types";
import InventoryLogType from "./types/inventory-log";

export default function BioMaterialInventory() {
  const db = useSQLiteContext();
  const [bioMaterials, setBioMaterials] = useState<BioMaterial[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogType[]>([]);
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

  const getBioMatData = async () => {
    try {
      const bioMatData: BioMaterial[] = await BioMat.readAll(db);
      setBioMaterials(bioMatData);

      const itemIds = bioMatData.map((d) => d.id);

      const cleanedLogs = [];

      for (let i = 0; i < itemIds.length; i++) {
        const id = itemIds[i];
        const bioRow = await InvLog.getByItemId(db, "bio_material", id);

        if (!bioRow) continue;

        // Flatten & sanitize DB row
        const cleaned = cleanRow(bioRow);
        cleanedLogs.push({
          ...cleaned,
          name: bioMatData[i].name,
          category: bioMatData[i].category,
          species_latin: bioMatData[i].species_latin
        });
      }

      setInventoryLogs(cleanedLogs);
    } catch (err) {
      console.error("Inventory loading error:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBioMatData();
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
                    <PurchaseLogsModal
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
