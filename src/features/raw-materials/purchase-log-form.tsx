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
import { RootDrawerParamsList } from "@navigation";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FormStateContext } from "src/context/FormContext";
import { ReceiptUploader } from "@components/upload-receipt";
import * as FileSystem from 'expo-file-system/legacy'


type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>


export default function PurchaseLogForm() {
    // const{ user, token } = useAuth();
    const db = useSQLiteContext();
    const navigation = useNavigation<NavigationProps>()

    // const navigation = useNavigation();    
    const [items, setItems] = useState([])
    const [formVisible, setFormVisible] = useState(false)
    const [pickedImageUri, setPickedImageUri] = useState("")
    const [brand, setBrand] = useState("")
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
    const [brands, setBrands] = useState([])
    const [newVendor, setNewVendor] = useState(false)
    const [vendorPhone, setVendorPhone] = useState("")
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorWebsite, setVendorWebsite] = useState("")

    const [image, setImage] = useState(null);
    const [contentType, setContentType] = useState("")
    
    const [receiptMemo, setReceiptMemo] = useState("")
    
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date())

    const { id } = useContext(FormStateContext)
    const { isNew } = useContext(FormStateContext)
    const { name, setName } = useContext(FormStateContext)
    const { category, setCategory } = useContext(FormStateContext)
    const { subcategory, setSubcategory } = useContext(FormStateContext)


  
    
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


    

    const handleSubmit = async () => {
        try {
            // if (!image) {
            //     Alert.alert("Error", "Please select a receipt image");
            //     return;
            // }
            // const { fileKey, publicUrl } = await uploadReceiptToCloudflare({
            //     image,
            //     token,
            //     contentType
            // })

            // const payload = {
            //     name: name,
            //     category: category,
            //     speciesLatin: speciesLatin,
            //     brand: brand,
            //     purchaseDate: purchaseDatetime,
            //     purchaseQuantity: parseInt(purchaseQuantity),
            //     purchaseUnit: purchaseUnit,
            //     inventoryQuantity: parseInt(inventoryQuantity),
            //     inventoryUnit: inventoryUnit,
            //     cost: parseInt(cost),
            //     vendor: vendor,
            //     user: user,
            //     filename: fileKey,
            //     imageUrl: publicUrl,
            //     receiptMemo: receiptMemo,
            //     notes : notes,
            //     vendorPhone: vendorPhone,
            //     vendorEmail: vendorEmail,
            //     vendorWebsite: vendorWebsite,
            // }
            console.log("Purchase Unit: ", purchaseUnit)
            const created_at = new Date().getTime();
            const item = await Item.getById(db, id)
            console.log("Inventory Unit: ", item.inventory_unit)

            const TYPE = 'raw_material'

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
                const itemId = await Item
                .update(
                    db,                
                    {
                        id, 
                        amount_on_hand: 
                            cnv.convertFromBase({
                                value: 
                                    (cnv.convertToBase({ value: item.amount_on_hand, from: item.inventory_unit === null ? 'gram' : item.inventory_unit }) || 0 )
                                    + (cnv.convertToBase({ value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity), from: inventoryUnit })),
                                to: 
                                    inventoryUnit
                            }),
                        last_updated:
                            created_at
                    }

                )
            }
            // if (newVendor) {
            //     // await Vendor.create(db, Vendor, vendorEmail, vendorPhone, vendorAd)
            // }
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
                brandId,
                parseFloat(cost)
            )
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


    const IMAGES_DIR = FileSystem.documentDirectory + "images/";

    async function saveImage(localUri: string, filename: string) {
    // Ensure images folder exists
    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    }

    const dest = IMAGES_DIR + filename;
    await FileSystem.copyAsync({
        from: localUri,
        to: dest,
    });

    return dest; // <- this becomes item.filePath
    }



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
            <View style={{ marginTop: 84 }}>
                <Button color={'#f74a63cc'} title='Submit' onPress={() => handleSubmit()} />
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
