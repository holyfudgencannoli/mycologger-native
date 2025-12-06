import { useState, useCallback, useEffect } from "react"
import { Modal, Surface,TextInput } from "react-native-paper";
import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import { RawMaterialsPurchaseLogModal } from "./detail-modal";
import { useSQLiteContext } from "expo-sqlite";
import * as RawMat from '@db/raw-materials'
import * as InvLog from '@db/inventory-logs'
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";


export default function RawMaterialInventory() {
    const db =  useSQLiteContext()
    const [rawMaterials, setRawMaterials] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState()
    const { theme, toggleTheme } = useTheme()
    const [inventoryLogs, setInventoryLogs] = useState([{}]);

    const getRMData = async() => {
        const data = await RawMat.readAll(db)
        const rmIds = data.map((datum) => datum.id)
        const invLogs: Array<{
            id: number,
            name: string,
            category: string,
            subcategory: string,
            amount_on_hand: number,
            inventory_unit: string,
            last_updated: number
        }> = [];
        for (let i = 0; i < rmIds.length; i++) {
            const id = rmIds[i];
            const rm = await RawMat.getById(db, id)
            console.log(rm.category)
            const log = await InvLog.getByItemId(db, 'raw_material', id)
            console.log(log)
            invLogs.push({
                id: rm.id,
                name: rm.name,
                category: rm.category,
                subcategory: rm.subcategory,
                amount_on_hand: log.amount_on_hand,
                inventory_unit: log.inventory_unit,
                last_updated: log.last_updated
            })
        }
        setInventoryLogs(invLogs)
        setRawMaterials(data)
    }

    useFocusEffect(
        useCallback(() => {
            getRMData()
            console.log(inventoryLogs)
        }, [])
    )

    const columns = [
        {key: 'name', title: 'Item Name'},
        {key: 'category', title: 'Category'},
        // {key: 'subcategory', title: 'Sub- category'},
        {key: 'amount_on_hand', title: 'Amount On Hand', unit: 'inventory_unit'}
        

    ]

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
                colors={['#94F8', '#00f', '#057']}
                style={{ flex: 1, padding: 16}}
            >
              <Surface style={styles.surfaceMetaContainer}>                        
                  <Surface style={styles.surfaceContainer}>
                  {inventoryLogs && inventoryLogs.length > 0 ? (
                      <>
                      <ScrollableDataTable 
                          data={inventoryLogs? inventoryLogs : []}
                          columns={columns}
                          headerTextStyle={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', textShadowColor:'blue', textShadowRadius: 4 }}
                          cellTextStyle={{ textAlign: 'center', color: 'white', textShadowColor: 'black', textShadowRadius:4 }}
                          headerStyle={{ backgroundColor: 'rgba(255,55,55,0.7)', }}
                          onRowPress={(item) => {openModal(item)}}
                      />
                      {modalOpen && (
                          <RawMaterialsPurchaseLogModal
                              visible={modalOpen}
                              setModalOpen={setModalOpen}
                              item={currentItem}
                          />
                      )}
                      </>
                      ) : (
                      <>
                      </>
                      )}
                  </Surface>
              </Surface>
            </LinearGradient>
        </View>
      </ScreenPrimative>
    )

}


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 20 },
  form: {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  },
  backgroundImage: {
    flex: 1
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
