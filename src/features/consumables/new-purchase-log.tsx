import { StyleSheet, View } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { Surface } from "react-native-paper";
import { useSQLiteContext } from "expo-sqlite";
import * as Item from '@db/items'
import * as Form from '@custom/react-native-forms/src'
import { useForm } from 'react-hook-form';
import PurchaseLogForm from './purchase-log-form';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { FormStateContext } from 'src/context/FormContext';
import { MyTabBar } from '@components/bottom-tabs';
import { tabs } from './types';

export default function NewPurchaseLog({ navigation, state }) {

    const [purchaseLogs, setPurchaseLogs] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([])
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])
    const db = useSQLiteContext();
    
    const { id, setId } = useContext(FormStateContext)
    const { isNew, setIsNew } = useContext(FormStateContext)
    const { name, setName } = useContext(FormStateContext)
    const { category, setCategory } = useContext(FormStateContext)
    const { subcategory, setSubcategory } = useContext(FormStateContext)


    const getItemNames = async() => {
        const data = await Item.getAllByType(db, 'consumable_item')
        setItems([{ id: 999999, name: 'New Item' }, ...items])
    }

    useFocusEffect(
        useCallback(() => {
            getItemNames()
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
                                    style={{ color: 'rgba(255, 0, 155, 1)', width: '100%' }}
                                    type='embed'
                                    size='lg'
                                    onValueChange={async(value: any) => {
                                        if (value.id === 999999) {
                                            setIsNew(true)
                                            setName('')
                                            setCategory('')
                                            setSubcategory('')
                                            setFormVisible(true)

                                        } else {
                                            setIsNew(false)
                                            setId(value.id)
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
                            <PurchaseLogForm /> : 
                            <></>
                        }
                        </LinearGradient>
                    </View>   
                                
                </ScreenPrimative>
            <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs} />
        </View>
    )

}


const styles = StyleSheet.create({
    container: { flex: 1 }
});