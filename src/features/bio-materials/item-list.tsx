// import { useState, useCallback, useEffect } from "react"
// import { useAuth } from "../../hooks/useAuthContext"
// import { Modal, Surface,TextInput } from "react-native-paper";
// import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useTheme } from "../../hooks/useTheme";
// import { useFocusEffect } from "@react-navigation/native";
// import { ScrollableDataTable } from "../../components/DataListWrapper";
// import { ImageBG } from "../../components/ImageBG";
// import { ScreenPrimative } from "../../components/ScreenPrimative";
// import BioMaterialsPurchaseLogModal from "./PurchaseLogs/Modal";
// import { apiFetch } from "../../services/apiFetch";
// import { useSQLiteContext } from "expo-sqlite";
// import * as BioMat from './../../data/db/bio-materials'


// export default function BioMaterialListScreen() {
//     const db = useSQLiteContext();
//     const [bioMaterials, setBioMaterials] = useState([])
//     const [modalOpen, setModalOpen] = useState(false)
//     const [currentItem, setCurrentItem] = useState()
//     const { theme, toggleTheme } = useTheme()

//     const getBioMatData = async() => {
//         const data: any = await BioMat.readAll(db)
//         setBioMaterials(data)
//     }

//     useFocusEffect(
//         useCallback(() => {
//             getBioMatData()
//             console.log(bioMaterials)
//         }, [])
//     )

//     const columns = [
//         {key: 'name', title: 'Item Name'},
//         {key: 'category', title: 'Category'},
//         {key: 'species_latin', title: 'Species Latin'}
//     ]

//     function openModal(item) {
//         setCurrentItem(item)
//         setModalOpen(true)
//     }
    


//     return(
//         <ImageBG
//             image={require('@assets/bg.jpg')}
//         >
//             <ScreenPrimative>
//                 <Surface style={styles.surfaceMetaContainer}>                        
//                     <Surface style={styles.surfaceContainer}>
//                     {bioMaterials && bioMaterials.length > 0 ? (
//                         <>
//                         <ScrollableDataTable 
//                             data={bioMaterials? bioMaterials : []}
//                             columns={columns}
//                             headerTextStyle={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', textShadowColor:'blue', textShadowRadius: 4 }}
//                             cellTextStyle={{ textAlign: 'center', color: 'white', textShadowColor: 'black', textShadowRadius:4 }}
//                             headerStyle={{ backgroundColor: 'rgba(255,55,55,0.7)', }}
//                             onRowPress={(item) => {openModal(item)}}
//                         />
//                         {modalOpen && (
//                             <BioMaterialsPurchaseLogModal
//                                 visible={modalOpen}
//                                 setModalOpen={setModalOpen}
//                                 item={currentItem}
//                             />
//                         )}
//                         </>
//                         ) : (
//                         <>
//                         </>
//                         )}
//                     </Surface>
//                 </Surface>
//             </ScreenPrimative>
//         </ImageBG>
//     )

// }


// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 20, marginBottom: 20 },
//   form: {
//     backgroundColor: 'rgba(0, 17, 255, 0.3)',
//     width:66    
//   },
//   backgroundImage: {
//     flex: 1
//   },
//   input: {
//     // margin: 8,
//     // padding: 8,
//     // gap: 16,
//     fontSize: 16
//   },
  
//   surface: {
//     padding: 8,
//     backgroundColor: 'white',
//     // margin: 8
//   },
//   surfaceContainer: {
//     padding: 16,
//     backgroundColor: 'rgba(56,185,255,0.3)'
//   },
//   surfaceMetaContainer: {
//     backgroundColor: 'rgba(55,255,55,0.4)',
//     width:350
//   },
//   title: {
//     fontSize: 24,
//     textAlign:  'center',
//     fontWeight: 'bold',
//     color: 'red',
//     textShadowColor: 'blue',
//     textShadowRadius: 16,
//   },
//   subtitle: {
//     fontSize: 18,
//     textAlign:  'center',
//     fontWeight: 'bold',
//     color: 'red',
//     textShadowColor: 'blue',
//     textShadowRadius: 16,
//   },
// measurementBox: {
//   flexDirection: 'row',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   gap: 8, // space between inputs (RN 0.71+)
//   paddingHorizontal: 8,
// },

// measurementInput: {
//   flex: 1,          // take equal space
//   minWidth: 120,    // never smaller than 120px
//   maxWidth: 180,    // optional: never bigger than 180px
// },

//    measurementContainer: {
//     display: 'flex',
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     padding: 10,
//   },
//   item: {
//     width: "30%",        // 3 items per row
//     aspectRatio: 1,      // makes it square
//     marginBottom: 10,
//     backgroundColor: "#4682B4",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   measurementText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   measurementFloatInput: {
//     width: 144
//   }
// });
