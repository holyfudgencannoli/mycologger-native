import { StyleSheet } from 'react-native';
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
        <ImageBG image={require('@assets/bg.jpg')}>
            <ScreenPrimative scroll edges={[]}>
                <Surface style={styles.surface}>
                    <Form.Control name='name'>
                        <Form.Select  
                            style={{ color: 'rgba(255, 0, 155, 1)', width: 300 }}
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
                </Surface>
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
            </ScreenPrimative>
        </ImageBG>
    )

}


const styles = StyleSheet.create({
  surface: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // marginBottom: 8
  },
});