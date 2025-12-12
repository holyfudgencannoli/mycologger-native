import { useCallback, useContext, useState } from "react"
import { Surface } from "react-native-paper";
import { StyleSheet, Text, Button, Alert, View } from 'react-native';
import { useEffect } from "react";
import * as PurchLog from '@db/purchase-logs'
import * as Vendor from '@db/vendors'
import * as Item from '@db/items'
import * as Brand from '@db/brands'
import * as cnv from '@utils/unitConversion'
import { useSQLiteContext } from "expo-sqlite";
import * as Form from '@custom/react-native-forms/src'
import { INV_UNITS, PUR_UNITS } from "@constants/units";
import { useForm } from "react-hook-form";
import NewBrandForm from "@features/brands/new-brand-form";
import { LinearGradient } from "expo-linear-gradient";
import NewVendorForm from "@features/vendors/new-vendor-form";
import { CaseHelper } from "@utils/case-helper";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootDrawerParamsList } from "@navigation/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FormStateContext } from "src/context/FormContext";
import { ReceiptUploader } from "@components/upload-receipt";
import * as FileSystem from 'expo-file-system/legacy'
import { saveReceiptLocally } from "@services/local-receipt";
import saveImage from "@services/save-image";
import { saveReceiptWithSAF } from "@utils/database-utils";
// import { saveFileWithSAF } from "@utils/database-utils";


type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>


export default function PurchaseLogForm() {
    // const{ user, token } = useAuth();
    const db = useSQLiteContext();
    const navigation = useNavigation<NavigationProps>()

    // const navigation = useNavigation();    
    const [items, setItems] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [pickedImageUri, setPickedImageUri] = useState("")
    const [brand, setBrand] = useState()
    const [newBrand, setNewBrand] = useState(false)
    const [purchaseQuantity, setPurchaseQuantity] = useState("")
    const [purchaseUnit, setPurchaseUnit] = useState("")
    const [inventoryQuantity, setInventoryQuantity] = useState("")
    const [inventoryUnit, setInventoryUnit] = useState("")
    const [cost, setCost] = useState("")
    const [receiptPath, setReceiptPath] = useState("")
    const [notes, setNotes] = useState("")

    const [vendorId, setVendorId] = useState<number>()
    const [brandId, setBrandId] = useState<number>()

    const [vendors, setVendors] = useState([])
    const [vendor, setVendor] = useState<Vendor.VendorType>()
    const [brands, setBrands] = useState([])
    const [newVendor, setNewVendor] = useState(false)
    const [vendorPhone, setVendorPhone] = useState("")
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorWebsite, setVendorWebsite] = useState("")

    
    const [receiptMemo, setReceiptMemo] = useState("")
    
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date())

    const formState = useContext(FormStateContext);
    if (!formState) {
            console.error("FormStateContext is undefined — missing provider!");
            return null;
    }

    const {
            item,
            id, setId,
            itemId, setItemId,
            isNew,
            image,
            contentType,
            name, setName,
            category, setCategory,
            subcategory, setSubcategory
    } = formState;


    
    const getData = async() => {
            const data = await Item.readAll(db)
            setItems(data)
    }


    async function getVendors() {
            const vendor_rows = await Vendor.readAll(db)
            setVendors([...vendor_rows, {id: 999999, name: 'New Vendor'}])
            return vendor_rows
    }

    async function getBrands() {
            const brand_rows = await Brand.readAll(db)
            setBrands([...brand_rows, {id: 999999, name: 'New Brand'}])
            return brand_rows
    }

    useFocusEffect(
    useCallback(() => {
                    getBrands()
                    getVendors()
        return() => {
            setName('')
            setCategory('')
            setSubcategory('')
        }
    }, [])
)


    

    const handleSubmit = async ({item, itemId, setItemId}) => {
            try {
                    console.log("Purchase Unit: ", purchaseUnit)
                    const created_at = new Date().getTime();
                    const TYPE = 'bio_material'

                    if (isNew) {
                            const itemIdReturn = await Item
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
                            setItemId(itemIdReturn)

                    } else {
                        console.log("Inventory Unit: ", inventoryUnit)
                        const itemUpdate = await Item
                            .update(
                            db,                
                        {
                            id: itemId, 
                            amount_on_hand: 
                                cnv.convertFromBase({
                                    value: 
                                        (cnv.convertToBase({ value: item.amount_on_hand, from: inventoryUnit }) || 0 )
                                        + (cnv.convertToBase({ value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity), from: inventoryUnit })),
                                    to: 
                                        inventoryUnit
                                }),
                            inventory_unit: inventoryUnit,
                            last_updated:
                                created_at
                            }

                        )
                    }
                    // if (newVendor) {
                    //     // await Vendor.create(db, Vendor, vendorEmail, vendorPhone, vendorAd)
                    // }

                    console.log("Inventory Unit: ", inventoryUnit)
                    const savedPath = await saveReceiptWithSAF(image, `receipt_image_${created_at}.jpeg`)
                    await PurchLog.ExecutePurchaseLog(
                        {db},
                        {
                            db,
                            type:TYPE,
                            item_id:item.id,
                            purchase_date:purchaseDatetime.getTime(),
                            purchase_unit:purchaseUnit,
                            purchase_amount:parseFloat(purchaseQuantity),
                            inventory_unit:inventoryUnit,
                            inventory_amount:parseFloat(inventoryQuantity),
                            vendor_id: vendorId ? vendorId : null,
                            brand_id: brandId ? brandId : null,
                            reciept_uri: savedPath ? savedPath : null,
                            cost:parseFloat(cost),
                            new_vendor: isNew ? vendor : null,
                            new_brand: isNew ? brand : null,
                            new_item: isNew ? item : null,
                            image: image ? image : null
                        }
                    )
                     
                    
                    // console.log("File Path: ", savedPath)
                    console.log(`Success! ${purchaseQuantity} ${purchaseUnit} of ${CaseHelper.toCleanCase(TYPE)} ${name} added to your inventory. Great Work!` )
            navigation.navigate("Dashboard")

            } catch(error) {
                    console.error(error)
            }
    }
    
    // const handleSubmit = async () => {
    //     if (!image) {
    //         Alert.alert("Error", "Please select a receipt image");
    //         return;
    //     }
    //     // const { fileKey, publicUrl } = await uploadReceiptToCloudflare({
    //     //     image,
    //     //     token,
    //     //     contentType
    //     // })

    //     // const payload = {
    //     //     name: name,
    //     //     category: category,
    //     //     subcategory: subcategory,
    //     //     brand: brand,
    //     //     purchaseDate: purchaseDatetime,
    //     //     purchaseQuantity: parseInt(purchaseQuantity),
    //     //     purchaseUnit: purchaseUnit,
    //     //     inventoryQuantity: parseInt(inventoryQuantity),
    //     //     inventoryUnit: inventoryUnit,
    //     //     cost: parseInt(cost),
    //     //     vendor: vendor,
    //     //     user: user,
    //     //     filename: fileKey,
    //     //     imageUrl: publicUrl,
    //     //     receiptMemo: receiptMemo,
    //     //     notes : notes,
    //     //     vendorPhone: vendorPhone,
    //     //     vendorEmail: vendorEmail,
    //     //     vendorWebsite: vendorWebsite,
    //     // }
            
    //     const created_at = new Date().getTime();
    //     const invItemId = await InvItem.create(db, 'bio_materials', created_at)
    //     const rawMatId = await RawMat.create(db, invItemId, name, category, subcategory)
    //     await PurchLog.create(
    //         db,
    //         'bio_materials',
    //         rawMatId,
    //         created_at,
    //         purchaseDatetime.getTime(),
    //         purchaseUnit,
    //         cnv.convertFromBase({
    //             value: parseFloat(purchaseQuantity),
    //             to: purchaseUnit
    //         }), inventoryUnit,
    //         cnv.convertFromBase({
    //             value: parseFloat(inventoryQuantity),
    //             to: inventoryUnit
    //         }),
    //         vendor,
    //         brand,
    //         parseFloat(cost)
    //     )
    //     await InvLog.create(
    //         db,
    //         'bio_materials',
    //         rawMatId,
    //         cnv.convertToBase({
    //             value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity),
    //             from: inventoryUnit
    //         }),
    //         inventoryUnit,
    //         created_at
    //     )
    //     return {invItemId, rawMatId}
    // }

    return (
        <>
            {isNew === true ? 
                <Form.Control labelStyle={styles.label} label="Item Name" name="name">
                    <Form.Input value={name} onChangeText={setName}  style={{ backgroundColor:'transparent', width: '100%' }} />
                </Form.Control> :
                <></>
            }
            <Form.Control labelStyle={styles.label} label='Item Category' name='category'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={category} onChangeText={setCategory}  />
            </Form.Control>
            <Form.Control label='Item Subcategory' labelStyle={styles.label} name='subcategory'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={subcategory} onChangeText={setSubcategory}  />
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
            {newBrand ? 
                <NewBrandForm />:
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
                            setVendorId(null)
                            setNewVendor(true)
                        } else{
                            setVendorId(value.id)
                            setVendor(value)
                            setNewVendor(false)
                        }
                    }}    
                    options={vendors}
                />
            </Form.Control>
            {newVendor ? 
                <NewVendorForm />:
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
                colors={['#94F8', '#00f', '#057']}
                style={{ flex: 1, padding: 16}}
            >
                <ReceiptUploader />
            </LinearGradient>
            <View style={{  marginTop: 36 }}>
                <Button color={'#f74a63cc'} title='Submit' onPress={() => handleSubmit({item, itemId, setItemId})} />
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
