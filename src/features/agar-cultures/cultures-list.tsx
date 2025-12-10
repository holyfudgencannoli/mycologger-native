import { useState, useCallback } from "react"
import { Surface } from "react-native-paper";
import { StyleSheet, View } from 'react-native';
import { useTheme } from "../../hooks/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollableDataTable } from "@components/scrollable-data-table";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import { CultureDetailModal } from "./detail-model";
import * as Culture from '@db/cultures'
import * as Agar from '@db/agar-cultures'
import { useSQLiteContext } from "expo-sqlite";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import * as Form from '@custom/react-native-forms/src'
import { AgarCulture } from "./types";


export default function AgarCulturesListScreen() {
    const db = useSQLiteContext();    
    const [recipes, setRecipes] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<AgarCulture>()
    const { theme, toggleTheme } = useTheme()
    const [agars, setAgars] = useState<AgarCulture[]>([])

    const getData = async() => {
        const Agars: AgarCulture[] = await Agar.readAll(db)
        console.log(Agars)  
        setAgars(Agars)
    }

    useFocusEffect(
        useCallback(() => {
            getData()
        }, [])
    )

    const columns = [
        {key: 'id', title: 'Culture ID'},
        {key: 'volume_amount', title: 'Volume', unit: 'volume_unit' },
        {key: 'last_updated', title: 'Last Updated', msDate: true}
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
                <View style={{ backgroundColor: '#fff8', height: '100%' }}>
                  <Form.Control name="table" label="Cultures" labelStyle={styles.label}>  
                    {agars && agars.length > 0 ? (
                        <>
                        <ScrollableDataTable 
                            data={agars? agars : []}
                            columns={columns}
                            headerTextStyle={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', textShadowColor:'blue', textShadowRadius: 4 }}
                            cellTextStyle={{ textAlign: 'center', color: 'white', textShadowColor: 'black', textShadowRadius:4 }}
                            headerStyle={{ backgroundColor: 'rgba(255,55,55,0.7)', }}
                            onRowPress={(item) => {openModal(item)}}
                        />
                        {modalOpen && (
                            <CultureDetailModal
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
                  </Form.Control>
                </View>
              </LinearGradient>
          </View>
        </ScreenPrimative>
    )

}


const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
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
