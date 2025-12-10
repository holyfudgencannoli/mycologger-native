import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import PurchaseLogForm from "./purchase-log-form";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Surface } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import * as Item from '@db/items'
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
    const [id, setId] = useState<number>()
    const [vendor, setVendor] = useState({})
    const [brandNames, setBrandNames] = useState([])

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [subcategory, setSubcategory] = useState("")

    const [isNewItem, setIsNewItem] = useState(true)

    async function itemLookup(name: string) {
        const data = await Item.getByName(db, name)
        setCategory(data.category)
        setSubcategory(data.subcategory)
        // const brandNames = (data.brand_names.map((name: string) => {name}))
        // setBrandNames(brandNames)
        // const vendorNames = (data.vendor_names.map((name: string) => name))
        // setVendorsNames(vendorNames)
        setFormVisible(true)
    }
        
    const getItems = async() => {
        const data = await Item.getAllByType(db, 'bio_material')
        setItems([{ id: 999999, name: 'New Item' }, { id: 10000, name: 'Test', category: 'Test', subcategory: 'Test' }, ...data])
    }

    const getPurchaseLogs = async() => {
        const data = await PurchLog.readAll(db, 'bio_materials')
        setPurchaseLogs(data)
    }

    const newItem = () => {
        setFormVisible(true)
        setCategory('')
        setSubcategory('')
    }

    useFocusEffect(
        useCallback(() => {
            getItems()
            getPurchaseLogs()   
                 
        }, [])
    )


    return(
            <ScreenPrimative edges={[]} scroll>
                <View style={styles.container}>
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
                                            setSubcategory('')
                                        } else {
                                            setFormVisible(true)
                                            setIsNewItem(false)
                                            setId(value.id)
                                            setName(value.name)
                                            setCategory(value.category)
                                            setSubcategory(value.subcategory)
                                        }

                                    }}    
                                    options={items}
                                />
                            </Form.Control>
                    {formVisible ? 
                        <PurchaseLogForm
                            id={id}
                            name={name}
                            category={category}
                            subcategory={subcategory}
                            setName={setName}
                            setCategory={setCategory}
                            setSubcategory={setSubcategory}
                            isNew={isNewItem}
                        /> : 
                        <></>
                    }
                    </LinearGradient>
            </View>                    
        </ScreenPrimative>
    )

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});