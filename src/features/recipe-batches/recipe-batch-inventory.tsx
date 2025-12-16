import { useState, useCallback } from "react"
import { Surface } from "react-native-paper";
import { StyleSheet, View } from 'react-native';
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ScreenPrimative } from "@components/screen-primative";
import RecipeBatchModal from "./detail-modal";
import * as RecipeBatch from '@db/recipe-batches'
import * as BatchLog from '@db/recipe-batch-inventory-logs'
import { useSQLiteContext } from "expo-sqlite";
import { LinearGradient } from "expo-linear-gradient";
import { MyTabBar } from "@components/bottom-tabs";
import { tabs } from "./types";
import { RecipeBatchInventoryLog } from "@db/recipe-batch-inventory-logs/types";


export default function RecipeBatchInventory({ navigation, state }) {
    const db = useSQLiteContext();    
    const [recipeBatches, setRecipeBatches] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState()
    const { theme, toggleTheme } = useTheme()

    const getRecipeBatchData = async() => {
      const data1: RecipeBatch.RecipeBatch[] = await RecipeBatch.readAll(db)
      console.log("Recipe Batches: ", data1)

      const data2: RecipeBatchInventoryLog[] = await BatchLog.readAll(db)
      console.log("Recipe Batch Inventory Logs: ", data2)

      let joined_logs = [];
      for (let i = 0; i < data1.length; i++) {
        const batch = data1[i];
        const log = data2[i];
        const full_log = {batch_id: batch.id, ...batch, log_id: log.id, ...log}
        console.log("FULL LOG: ", full_log)
        joined_logs.push(full_log)
      }
      console.log("Full Logs: ", joined_logs)
      setRecipeBatches(joined_logs)
    }

    useFocusEffect(
      useCallback(() => {
        getRecipeBatchData()
      }, [])
    )

  const columns = [
    { key: "name", title: "Item Name" },
    { key: "amount_on_hand", title: "Amount On Hand", unit: "inventory_unit" },
    { key: "last_updated", title: "Last Updated", msDate: true },

  ];


    function openModal(item) {
        setCurrentItem(item)
        setModalOpen(true)
    }
    


    return(
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
                    {recipeBatches && recipeBatches.length > 0 ? (
                        <>
                        <ScrollableDataTable 
                            data={recipeBatches? recipeBatches : []}
                            columns={columns}
                            headerTextStyle={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', textShadowColor:'blue', textShadowRadius: 4 }}
                            cellTextStyle={{ textAlign: 'center', color: 'white', textShadowColor: 'black', textShadowRadius:4 }}
                            headerStyle={{ backgroundColor: 'rgba(255,55,55,0.7)', }}
                            onRowPress={(item) => {openModal(item)}}
                        />
                        </>
                        ) : (
                        <>
                        </>
                        )}
                    </Surface>
                    
                        {modalOpen && (
                            <RecipeBatchModal
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
    )

}


const styles = StyleSheet.create({
  container: { flex: 1 },
  text: { fontSize: 20, marginBottom: 20 },
  form: {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  },
  input: {
    // margin: 8,
    // padding: 8,
    // gap: 16,
    fontSize: 16
  },
  
  surface: {
    padding: 8,
    backgroundColor: 'white',
    // margin: 8
  },
  surfaceContainer: {
    padding: 16,
    backgroundColor: 'rgba(56,185,255,0.3)'
  },
  surfaceMetaContainer: {
    backgroundColor: 'rgba(55,255,55,0.4)',
    width:350
  },
  title: {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
measurementBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8, // space between inputs (RN 0.71+)
  paddingHorizontal: 8,
},

measurementInput: {
  flex: 1,          // take equal space
  minWidth: 120,    // never smaller than 120px
  maxWidth: 180,    // optional: never bigger than 180px
},

   measurementContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  item: {
    width: "30%",        // 3 items per row
    aspectRatio: 1,      // makes it square
    marginBottom: 10,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  measurementText: {
    color: "white",
    fontWeight: "bold",
  },
  measurementFloatInput: {
    width: 144
  }
});
