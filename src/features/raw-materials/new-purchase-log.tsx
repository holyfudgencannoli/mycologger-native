import { StyleSheet, View } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Surface } from "react-native-paper";
import * as RawMat from '@db/raw-materials'
import { useSQLiteContext } from "expo-sqlite";

import * as Form from '@custom/react-native-forms/src'
import { useForm } from 'react-hook-form';
import PurchaseLogForm from './purchase-log-form';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';


export default function NewPurchaseLog() {
    const db = useSQLiteContext();
    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            name: '',
            category: '',
            subcategory: ''
            },
    });
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([{}])
    const [item, setItem] = useState({})
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])
    const [newItem, setNewItem] = useState(false)

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [subcategory, setSubcategory] = useState("")


    
    const getData = async() => {
        const data = await RawMat.readAll(db)
        setItems([data, { id: 999999, name: 'New Item' }])
    }

    useFocusEffect(
        useCallback(() => {
            getData()
        }, [])
    )




    return(
        <ScreenPrimative edges={[]}>
            <View style={styles.container}>	
                <ScrollView style={{ flex: 1 }}>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.3, y: 0.9 }}
                        colors={['#94F8', '#00f', '#057']}
                        style={{ flex: 1, padding: 16}}
                    >
                        <Form.Control name='name'>
                            <Form.Select  
                                type='embed'
                                style={{ color: 'rgba(255, 0, 155, 1)', width: '100%' }}
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