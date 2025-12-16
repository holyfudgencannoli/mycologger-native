import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Surface } from "react-native-paper";
import { useFocusEffect, useRoutePath } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ScreenPrimative } from "@components/screen-primative";
import { PurchaseLogsModal } from "./detail-modal";
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import * as Item from '@db/items';
import * as Usage from '@db/usage_logs';
import { ItemProps } from "@db/items/types";
import { CaseHelper } from "@utils/case-helper";
import { MyTabBar } from "@components/bottom-tabs";
import { tabs } from "./types";
import * as BatchLog from '@db/recipe-batches';
import * as BatchInventory from '@db/recipe-batch-inventory-logs';

export default function RawMaterialUsage({ navigation }) {
  const db = useSQLiteContext();
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemProps | null>(null);
  const path = useRoutePath();

  const getRMData = async () => {
    try {
      const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[3]).slice(0, -1));
      let true_type: string;
      let itemData: any[] = [];
      let data: any[] = [];
      let fullData: any[] = [];

      if (TYPE === 'recipe_batche') {
        true_type = 'recipe_batch';
        itemData = (await BatchLog.readAll(db)) ?? [];
        data = (await Usage.readAll(db)) ?? [];
      } else if (TYPE === 'supplie') {
        true_type = 'consumable_item';
        itemData = (await Item.getAllByType(db, true_type)) ?? [];
        data = (await Usage.getByType(db, true_type)) ?? [];
      } else {
        true_type = TYPE;
        itemData = (await Item.getAllByType(db, true_type)) ?? [];
        data = (await Usage.getByType(db, true_type)) ?? [];
      }

      // Safely merge usage & item data
      fullData = data.map((datum, index) => {
        const usage = { ...datum };
        const item = itemData[index] ? { ...itemData[index] } : {};
        return { ...usage, ...item };
      });

      setInventoryLogs(fullData);
      console.log("Inventory Logs:", fullData);

      return fullData.map((d) => d.id);
    } catch (err) {
      console.error("Inventory loading error:", err);
      return [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRMData();
    }, [])
  );

  const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[3]).slice(0, -1));
  const columns =
    TYPE === 'recipe_batche'
      ? [
          { key: "name", title: "Item Name" },
          { key: "total_usage", title: "Total Usage", unit: "usage_unit" },
        ]
      : [
        
          { key: "name", title: "Item Used" },
          { key: "total_usage", title: "Total Usage", unit: "usage_unit" },
      ];

  const openModal = (item: ItemProps) => {
    setCurrentItem(item);
    setModalOpen(true);
  };

  return (
    <>
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
                        textShadowRadius: 4,
                      }}
                      cellTextStyle={{
                        textAlign: "center",
                        color: "white",
                        textShadowColor: "black",
                        textShadowRadius: 4,
                      }}
                      headerStyle={{ backgroundColor: "rgba(255,55,55,0.7)" }}
                      onRowPress={openModal}
                    />
                    {modalOpen && currentItem && (
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
      <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  surfaceContainer: {
    padding: 16,
    backgroundColor: "rgba(56,185,255,0.3)",
  },
  surfaceMetaContainer: {
    backgroundColor: "rgba(55,255,55,0.4)",
    width: 350,
  },
});
