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
        <ImageBG image={require('@assets/bg.jpg')}>
            <ScreenPrimative scroll edges={[]}>
                <Surface style={styles.surface}>
                    <Picker
                       dropdownIconColor={'blanchedalmond'}
                        style={{ color: 'blanchedalmond' }}
                        onValueChange={(value: {id: number, name: string, category: string, species_latin: string}) => {
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
                    >
                        {items.map((item) => {
                            return(
                                <Picker.Item label={item.name} value={{...item}} />
                            )
                        })}
                    </Picker>
                    {/* <FormInputAutocomplete 
                        options={itemNames}
                        placeholder="Item Name"
                        onChangeText={setName}
                        inputValue={name}
                        onSelect={itemLookup}
                    /> */}
                </Surface>
                {formVisible ? 
                    <PurchaseLogForm
                        name={name}
                        category={category}
                        speciesLatin={speciesLatin}
                        setName={setName}
                        setCategory={setCategory}
                        setSpeciesLatin={setSpeciesLatin}
                    /> : <></>}
            </ScreenPrimative>
        </ImageBG>
    )

}


const styles = StyleSheet.create({
  surface: {
    padding: 16,
    backgroundColor: 'rgba(60,60,160,0.8)',
    display: 'flex',
    width: 250,
    margin: 'auto'
    // marginBottom: 8
  },
});