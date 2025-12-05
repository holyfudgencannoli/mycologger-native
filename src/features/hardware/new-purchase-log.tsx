import { StyleSheet, Text, View, ImageBackground, Button, Alert, ScrollView } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Surface } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import * as Consumable from '@db/consumable-items'
import { useSQLiteContext } from "expo-sqlite";
import CreateConsumableItemPurchase from "./purchase-log-form";
import PurchaseLogForm from './purchase-log-form';
import * as HW from '@db/hardware-items'
import { LinearGradient } from 'expo-linear-gradient';
import * as Form from '@custom/react-native-forms/src'


export default function NewPurchaseLog() {

    const [purchaseLogs, setPurchaseLogs] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([])
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])
    const db = useSQLiteContext();
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [subcategory, setSubcategory] = useState("")

    const [newItem, setNewItem] = useState(false)


    const getItemNames = async() => {
        const items = await HW.readAll(db)
        setItems([...items, { id: 999999, name: 'New Item' }])
    }

    useFocusEffect(
        useCallback(() => {
            getItemNames()
        }, [])
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
                                        setNewItem(true)
                                        setName('')
                                        setCategory('')
                                        setSubcategory('')
                                        setFormVisible(true)

                                    } else {
                                        setNewItem(false)
                                        setName(value.name)
                                        setCategory(value.email)
                                        setSubcategory(value.phone)
                                        setFormVisible(true)
                                    }

                                }}    
                                options={items}
                            />
                        </Form.Control>
                    {formVisible ? 
                        <PurchaseLogForm 
                            name={name}
                            category={category}
                            subcategory={subcategory}
                            setCategory={setCategory}
                            setSubcategory={setSubcategory}
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