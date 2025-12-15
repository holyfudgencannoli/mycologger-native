import { useState, useCallback, useContext } from "react"
import { Surface,TextInput } from "react-native-paper";
import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoutePath } from '@react-navigation/native';
import { useEffect } from "react";
import { uploadReceiptToCloudflare } from "../../services/UploadReceiptToCloudflare";
// import UploadReceipt from "../UploadReceipt";
// import CreateVendor from "./CreateVendor";
import * as PurchLog from '@db/purchase-logs'
import * as Vendor from '@db/vendors'
import * as Brand from '@db/brands'
import * as cnv from '@utils/unitConversion'
import { useSQLiteContext } from "expo-sqlite";
import { Picker } from "@react-native-picker/picker";

import * as Form from '@custom/react-native-forms/src'
import { INV_UNITS, PUR_UNITS } from "@constants/units";
import * as Item from '@db/items'
import { CaseHelper } from "@utils/case-helper";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamsList } from "@navigation/types";
import { BrandFormStateContext, FormStateContext, VendorFormStateContext } from "src/context/FormContext";
import saveImage from "@services/save-image";
import { LinearGradient } from "expo-linear-gradient";
import { ReceiptUploader } from "@components/upload-receipt";
import { saveReceiptWithSAF } from "@utils/database-utils";
import { COLORS } from "@constants/colors";
import { PurchaseLogType } from "@db/purchase-logs/types";
import NewBrandForm from "@features/brands/new-brand-form";
import NewVendorForm from "@features/vendors/new-vendor-form";

type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>



export default function PurchaseLogForm() {
    // const{ user, token } = useAuth();
    const db = useSQLiteContext();
    const navigation = useNavigation<NavigationProps>()
    const path = useRoutePath();

    // const navigation = useNavigation();    
    const [items, setItems] = useState([])
    const [newBrand, setNewBrand] = useState(false)

    const [vendors, setVendors] = useState([])
    const [brands, setBrands] = useState([])
    const [newVendor, setNewVendor] = useState(false)

    
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date())

    const { id,
        image,
        brand, setBrand,
        vendor, setVendor,
        item, setItem,
        isNew,
        name, setName,
        category, setCategory,
        subcategory, setSubcategory,
        purchaseQuantity, setPurchaseQuantity,
        purchaseUnit, setPurchaseUnit,
        inventoryQuantity, setInventoryQuantity,
        inventoryUnit, setInventoryUnit,
        cost, setCost,
        notes, setNotes,
        vendorId, setVendorId,
        brandId, setBrandId } = useContext(FormStateContext);

    const brandState = useContext(BrandFormStateContext)

    const vendorState = useContext(VendorFormStateContext)

  
    
    const getData = async() => {
        const data = await Item.readAll(db)
        setItems(data)
    }


    async function getVendors() {
        const vendor_rows = await Vendor.readAll(db)
        setVendors([{id: 999999, name: 'New Vendor'}, ...vendor_rows])
        return vendor_rows
    }

    async function getBrands() {
        const brand_rows = await Brand.readAll(db)
        setBrands([{id: 999999, name: 'New Brand'}, ...brand_rows])
        return brand_rows
    }

    useFocusEffect(
        useCallback(() => {
            getData()
            getVendors()
            getBrands()
            return() => {
                setVendor(null)
                setBrand(null)
                setName('')
				setCategory('')
				setSubcategory('')
                setPurchaseQuantity('')
                setPurchaseUnit('')
                setInventoryQuantity('')
                setInventoryUnit('')
                setCost('')
                setNotes('')
            }

        }, [])
    )

    const handleSubmit = async () => {
        try {
            
            if (isNew) {
                const itemNames: string[] = items.map((item) => item.name)
                if (itemNames.includes(name)) {
                    Alert.alert("Duplicate Item Creation", "Item Already Exists!")
                    return
                }
            }
            if (newBrand) {
                const brandNames: string[] = brands.map((brand) => brand.name)
                if (brandNames.includes(brandState.brandName)) {
                    Alert.alert("Duplicate Brand Creation", "Brand Already Exists!")
                    return
                } 
            }
            if (newVendor) {
                const vendorNames: string[] = vendors.map((vendor) => vendor.name)
                if (vendorNames.includes(vendorState.name)) {
                    Alert.alert("Duplicate Vendor Creation", "Vendor Already Exists!")
                    return
                } 
            }

            if (!image) {
                Alert.alert("Error", "Please select a receipt image");
                return;
            }


            const created_at = new Date().getTime();
            const item = await Item.getById(db, id)
            const TYPE = CaseHelper.toSnakeCase(decodeURIComponent(path.split('/')[2])).slice(0, -1)
            console.log("Item.unit", item.inventory_unit)
            console.log("Inventory", inventoryUnit)
            console.log("Item.unit", item.inventory_unit)

            if (isNew) {
                const itemId = await Item
                .create(
                    db,
                    name,
                    category,
                    subcategory,
                    TYPE,
                    created_at,
                    parseFloat(purchaseQuantity),
                    purchaseUnit,
                    null,
                    created_at,
                    null,
                    null
                )
            } else {
                let Amount: number;
                let Unit: string;
                if (item.inventory_unit === null) { 
                    Amount = cnv.convertFromBase({
                        value: 
                            (cnv.convertToBase({ value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity), from: inventoryUnit })),
                        to: 
                            inventoryUnit
                    })
                    Unit = inventoryUnit
                    } else {
                        Amount = cnv.convertFromBase({
                            value: 
                                cnv.convertToBase({ value: item.amount_on_hand, from: item.inventory_unit  }) 
                                + (cnv.convertToBase({ value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity), from: item.inventory_unit })),
                            to: 
                                item.inventory_unit
                        })
                        Unit = item.inventory_unit
                }

                const itemId = await Item
                .update(
                    db,                
                    {
                        id, 
                        amount_on_hand: Amount,
                        inventory_unit: Unit,
                        last_updated: created_at
                    }

                )
            }
            let current_brand_id: number;
            let current_vendor_id: number;
            if (newBrand) {
                const brandId = await Brand.create(
                    db,
                    brandState.brandName,
                    brandState.brandWebsite,
                    created_at
                )
                current_brand_id = brandId
            } else {
                current_brand_id = brand.id
            }
            if (newVendor) {
                const vendorId = await Vendor.create(
                    db,
                    vendorState.name,
                    vendorState.email,
                    vendorState.phone,
                    vendorState.address,
                    vendorState.contactName,
                    vendorState.website,
                    created_at
                )
                current_vendor_id = vendorId
            } else {
                current_vendor_id = vendor.id
            }
            const savedPath = await saveReceiptWithSAF(image, `receipt_image_${created_at}`)
            console.log(savedPath)    
            await PurchLog.create(
                db,
                TYPE,
                item.id,
                created_at,
                purchaseDatetime.getTime(),
                purchaseUnit,
                parseFloat(purchaseQuantity),
                inventoryUnit,
                parseFloat(inventoryQuantity),
                vendorId,
                current_brand_id,
                savedPath,
                parseFloat(cost)
            )
    		navigation.navigate("Dashboard")

            console.log(`Success! ${purchaseQuantity} ${purchaseUnit} of ${CaseHelper.toCleanCase(TYPE)} ${name} added to your inventory. Great Work!` )

        } catch(error) {
            console.error(error)
        }
    }

    return (
        <>
            {
                isNew ?
                <Form.Control labelStyle={styles.label} label='Item Name' name='name'>
                    <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={name} onChangeText={setName}  />
                </Form.Control> :
                <></>
            }
            <Form.Control labelStyle={styles.label} label='Item Category' name='category'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={isNew ? category : item.category} onChangeText={isNew ? setCategory : null}  />
            </Form.Control>
            <Form.Control label='Item Subcategory' labelStyle={styles.label} name='subcategory'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={isNew ? subcategory : item.subcategory} onChangeText={isNew ? setSubcategory : null}  />
            </Form.Control>
            <Form.Control name="brand" label="Brand" labelStyle={styles.label} >
                <Form.Select
                    size="sm" 
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    onValueChange={(value: any)=> {
                        if (value.id === 999999) {
                            setBrand(null)
                            setNewBrand(true)
                        } else{
                            setBrand(value)
                            setNewBrand(false)
                        }
                    }}
                    options={brands}
                />
            </Form.Control>
            {
                newBrand ? 
                <NewBrandForm /> :
                <></>
            }
            <Form.Control labelStyle={styles.label} label="Purchase Quantity" name="purchase_quantity" >
                <Form.Input
                    value={purchaseQuantity}
                    onChangeText={setPurchaseQuantity} 
                    style={{ width: '50%', backgroundColor: 'transparent', color: 'white' }}
                />
                <Form.Select
                    style={{ width: '50%', backgroundColor: 'transparent' }} 
                    options={[...PUR_UNITS]}
                    onValueChange={(value: any) => {
                        setPurchaseUnit(value.value)
                        console.log(value.value)
                    }}
                />
            </Form.Control>
            <Form.Control labelStyle={styles.label} label="Inventory Quantity" name="inventory_quantity" >
                <Form.Input
                    value={inventoryQuantity}
                    onChangeText={setInventoryQuantity} 
                    style={{ width: '50%', backgroundColor: 'transparent' }}
                />
                <Form.Select
                    style={{ width: '50%', backgroundColor: 'transparent' }} 
                    options={[...INV_UNITS]}
                    onValueChange={(value: any) => {
                        setInventoryUnit(value.value)
                        console.log(value.value)
                    }}
                />
            </Form.Control>
            <Form.Control labelStyle={styles.label} label="Cost" name="cost" >
                <Form.Input 
                    value={cost}
                    onChangeText={setCost}
                     style={{ backgroundColor: 'transparent', width: '100%' }} 
                />
            </Form.Control>
            <Form.Control name="vendor" label="Vendor" labelStyle={styles.label}>
                <Form.Select 
                    style={{ width: '100%', backgroundColor: 'transparent' }}
                    onValueChange={(value: any)=> {
                        if (value.id === 999999) {
                            setVendor(null)
                            setNewVendor(true)
                        } else{
                            setVendor(value)
                            setNewVendor(false)
                        }
                    }}    
                    options={vendors}
                />
            </Form.Control>
            {
                newVendor ? 
                <NewVendorForm /> :
                <></>
            }
            <Form.Control name="notes" label="Notes" labelStyle={styles.label}>
                <Form.Input 
                    multiline
                    value={notes}
                    onChangeText={setNotes}
                    style={{ backgroundColor: 'transparent', width: '100%' }} 
                />
            </Form.Control>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.9 }}
                colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
                style={{ flex: 1, padding: 16}}
            >
                <ReceiptUploader />
            </LinearGradient>
            <View style={{ marginTop: 84 }}>
                <Button color={COLORS.button.primary} title='Submit' onPress={handleSubmit} />
            </View>
        </>
    )
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  text: { fontSize: 20, marginBottom: 20 },
  form: {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  },
  backgroundImage:{
    paddingBottom: 300
  },
  input: {
    // margin: 8,
    // padding: 8,
    // gap: 16,
    fontSize: 16 
  },
  surface: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // marginBottom: 8
  },
  surfaceBottom: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 24
  },
  surfaceContainer: {
    padding: 16,
    backgroundColor: 'rgba(56,185,255,0.3)'
  },
  surfaceMetaContainer: {
    backgroundColor: 'rgba(55,255,55,0.4)',
    width:350,
    margin: 'auto',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },

  item: {
    width: "30%",        // 3 items per row
    aspectRatio: 1,      // makes it square
    marginBottom: 10,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
});
