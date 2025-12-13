import { StyleSheet, Text, View, ImageBackground, Button, Alert, ScrollView } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { ImageBG } from "@components/image-bg";
import { useFocusEffect, useRoutePath } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { Surface } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";
import CreateConsumableItemPurchase from "./purchase-log-form";
import PurchaseLogForm from './purchase-log-form';
import * as Item from '@db/items'
import { LinearGradient } from 'expo-linear-gradient';
import * as Form from '@custom/react-native-forms/src'
import { FormStateContext } from 'src/context/FormContext';
import { MyTabBar } from '@components/bottom-tabs';
import { tabs } from './types';
import { COLORS } from '@constants/colors';
import { CaseHelper } from '@utils/case-helper';


export default function NewPurchaseLog({ navigation, state }) {

    const [purchaseLogs, setPurchaseLogs] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([])
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])
    const db = useSQLiteContext();
    const path = useRoutePath();


    const { 
        id, setId,
        isNew, setIsNew,
        name, setName,
        category, setCategory,
        subcategory, setSubcategory,
        type, setType } = useContext(FormStateContext)




    const getItemNames = async() => {
        const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[2])).slice(0, -1)
        setType(TYPE)
        const data = await Item.getAllByType(db, TYPE)
        setItems([{ id: 999999, name: 'New Item' }, ...data])
    }

    useFocusEffect(
        useCallback(() => {
            getItemNames()
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
                            colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
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