import { View } from 'react-native';
import { ScreenPrimative } from "@components/screen-primative";
import { useFocusEffect, useRoutePath } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import PurchaseLogForm from './purchase-log-form';
import * as Item from '@db/items'
import { LinearGradient } from 'expo-linear-gradient';
import * as Form from '@custom/react-native-forms/src'
import { BrandFormStateContext, FormStateContext, VendorFormStateContext } from 'src/context/FormContext';
import { MyTabBar } from '@components/bottom-tabs';
import { tabs } from './types';
import { COLORS } from '@constants/colors';
import { CaseHelper } from '@utils/case-helper';
import { CONTAINER, FORM } from '@constants/styles';


export default function NewPurchaseLog({ navigation, state }) {

    const [purchaseLogs, setPurchaseLogs] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [items, setItems] = useState([])
    const [vendorsNames, setVendorsNames] = useState([])
    const [brandNames, setBrandNames] = useState([])
    const db = useSQLiteContext();
    const path = useRoutePath();
    const vendor = useContext(VendorFormStateContext)
    
    const {
            brandName, setBrandName,
            brandWebsite, setBrandWebsite
        } = useContext(BrandFormStateContext)
    

    const { 
        item, setItem,
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
                setBrandName('')
                setBrandWebsite('')
                
                vendor.setAddress('')
                vendor.setContactName('')
                vendor.setEmail('')
                vendor.setName('')
                vendor.setPhone('')
                vendor.setWebsite('')
			}
        }, [])
    )

    return(
        <View style={CONTAINER.FULL}>
            
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.9 }}
                colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
                style={{ flex: 1, padding: 16}}
            >
                <ScreenPrimative edges={[]} scroll>
                    <View>
                        <Form.Control name='name' label={`NEW ${CaseHelper.toCleanCase(decodeURIComponent(path.split('/')[2])).slice(0, -1).toUpperCase()} \n  PURCHASE LOG`} labelStyle={FORM.TITLE}>
                            <Form.Select
                                style={{ color: 'rgba(255, 0, 155, 1)', width: '100%' }}
                                type='embed'
                                size='lg'
                                onValueChange={async(value: any) => {
                                    if (value.id === 999999) {
                                        setIsNew(true)
                                        setItem(null)
                                        setId(null)
                                        setName('')
                                        setCategory('')
                                        setSubcategory('')
                                        setFormVisible(true)

                                    } else {
                                        console.log(value)
                                        setIsNew(false)                      
                                        setItem(value)
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
                    </View>                            
                </ScreenPrimative>
            </LinearGradient>
            <MyTabBar navigation={navigation} state={navigation.getState()} tabs={tabs} />
        </View>
    )

}

