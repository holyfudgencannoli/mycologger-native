import { StyleSheet, View } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { Surface } from "react-native-paper";
import * as Item from '@db/items'
import { useSQLiteContext } from "expo-sqlite";

import * as Form from '@custom/react-native-forms/src'
import { useForm } from 'react-hook-form';
import PurchaseLogForm from './purchase-log-form';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { FormStateContext } from 'src/context/FormContext';
import { MyTabBar } from '@components/bottom-tabs';
import { tabs } from './types/raw-material';


export default function NewPurchaseLog({ navigation, state }) {
    const db = useSQLiteContext();
    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: {
            name: '',
            category: '',
            subcategory: ''
            },
    });
    const [formVisible, setFormVisible] = useState(false)
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])

    
    const {
        item, setItem,
        items, setItems,
        setItemId,
        setId,
        setIsNew,
        setName,
        setCategory,
        setSubcategory } = useContext(FormStateContext)

    
    const getData = async() => {
        const data: any = await Item.getAllByType(db, 'raw_material')
        setItems([{ id: 999999, name: 'New Item',  }, ...data])
    }

    useFocusEffect(
		useCallback(() => {
			getData()
            console.log(items)
			return() => {
				setName('')
				setCategory('')
				setSubcategory('')
			}
		}, [])
	)





    return(
        <View style={styles.container}>
        <ScreenPrimative edges={[]} scroll>
            <View>	
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
                                        setIsNew(true)
                                        setName('')
                                        setCategory('')
                                        setSubcategory('')
                                        setFormVisible(true)

                                    } else {
                                        setIsNew(false)
                                        setItem(value)
                                        setItemId(value.id)
                                        setName(value.name)
                                        setCategory(value.category)
                                        setSubcategory(value.subcategory)
                                        setFormVisible(true)
                                    }
                                }}  
                                options={items}
                            />
                        </Form.Control>
                    {formVisible ? 
                        <PurchaseLogForm /> : 
                        <></>
                    }
                    </LinearGradient>
                        
                </View>
            </ScreenPrimative>
            <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs}/>
        </View>
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

});