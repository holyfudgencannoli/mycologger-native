import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import PurchaseLogForm from "./purchase-log-form";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Surface } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import * as BioMat from '@db/bio-materials'
import * as PurchLog from '@db/purchase-logs'
import { Picker } from "@react-native-picker/picker";
import * as Vendor from '@db/vendors'
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Form from '@custom/react-native-forms/src'



export default function NewPurchaseLog() {
    const db = useSQLiteContext();

    const [purchaseLogs, setPurchaseLogs] = useState<any>()
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([])
    const [vendor, setVendor] = useState({})
    const [brandNames, setBrandNames] = useState([])

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [speciesLatin, setSpeciesLatin] = useState("")

    const [isNewItem, setIsNewItem] = useState(true)

    async function itemLookup(name: string) {
        const data = await BioMat.getByName(db, name)
        setCategory(data.category)
        setSpeciesLatin(data.species_latin)
        // const brandNames = (data.brand_names.map((name: string) => {name}))
        // setBrandNames(brandNames)
        // const vendorNames = (data.vendor_names.map((name: string) => name))
        // setVendorsNames(vendorNames)
        setFormVisible(true)
    }
        
    const getItems = async() => {
        const data = await BioMat.readAll(db)
        setItems([...data, { id: 10000, name: 'Test', category: 'Test', speciesLatin: 'Test' }, { id: 999999, name: 'New Item' }])
    }

    const getPurchaseLogs = async() => {
        const data = await PurchLog.readAll(db, 'bio_materials')
        setPurchaseLogs(data)
    }

    const newItem = () => {
        setFormVisible(true)
        setCategory('')
        setSpeciesLatin('')
    }

    useFocusEffect(
        useCallback(() => {
            getItems()
            getPurchaseLogs()   
                 
        }, [isNewItem])
    )


    return(
            <ScreenPrimative edges={[]}>
                <View style={styles.container}>
                    <ScrollView>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.3, y: 0.9 }}
                            colors={['#94F8', '#00f', '#057']}
                            style={{ flex: 1, padding: 16}}
                        >
                            <Form.Control name='name'>
                                <Form.Select
                                    style={{ color: 'rgba(255, 0, 155, 1)', width: '100%' }}
                                    type='embed'
                                    size='lg'
                                    onValueChange={async(value: any) => {
                                        if (value.id === 999999) {
                                            setFormVisible(true)
                                            setIsNewItem(true)
                                            setName('')
                                            setCategory('')
                                            setSpeciesLatin('')
                                        } else {
                                            setFormVisible(true)
                                            setIsNewItem(false)
                                            setName(value.name)
                                            setCategory(value.category)
                                            setSpeciesLatin(value.species_latin)
                                        }

                                    }}    
                                    options={items}
                                />
                            </Form.Control>
                    {formVisible ? 
                        <PurchaseLogForm
                            name={name}
                            category={category}
                            speciesLatin={speciesLatin}
                            setName={setName}
                            setCategory={setCategory}
                            setSpeciesLatin={setSpeciesLatin}
                        /> : 
                        <></>
                    }
                    </LinearGradient>
                </ScrollView>
            </View>                    
        </ScreenPrimative>
    )

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});