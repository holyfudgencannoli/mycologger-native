import { useState } from "react"
import { Surface } from "react-native-paper";
import { StyleSheet, Text, Button, Alert } from 'react-native';
import { useEffect } from "react";
import * as InvItem from '@db/inventory-items'
import * as RawMat from '@db/bio-materials'
import * as PurchLog from '@db/purchase-logs'
import * as InvLog from '@db/inventory-logs'
import * as Vendor from '@db/vendors'
import * as Brand from '@db/brands'
import * as cnv from '@utils/unitConversion'
import { useSQLiteContext } from "expo-sqlite";
import * as Form from '@custom/react-native-forms/src'
import { INV_UNITS, PUR_UNITS } from "@constants/units";




export default function PurchaseLogForm({
    name,
    category,
    subcategory,
    setCategory,
    setSubcategory
} : {
    name?: string,
    category?: string,
    subcategory?: string,
    setCategory?: (category: string) => void,
    setSubcategory?: (subcategory: string) => void
}) {
    // const{ user, token } = useAuth();
    const db = useSQLiteContext();

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

    const [vendor, setVendor] = useState("")

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
  
    
    const getData = async() => {
        const data = await RawMat.readAll(db)
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

    useEffect(() => {
        getVendors()
        getBrands()

    }, [])


    
    const handleSubmit = async () => {
        if (!image) {
            Alert.alert("Error", "Please select a receipt image");
            return;
        }
        // const { fileKey, publicUrl } = await uploadReceiptToCloudflare({
        //     image,
        //     token,
        //     contentType
        // })

        // const payload = {
        //     name: name,
        //     category: category,
        //     subcategory: subcategory,
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
        
        const created_at = new Date().getTime();
        const invItemId = await InvItem.create(db, 'bio_materials', created_at)
        const rawMatId = await RawMat.create(db, invItemId, name, category, subcategory)
        await PurchLog.create(
            db,
            'bio_materials',
            rawMatId,
            created_at,
            purchaseDatetime.getTime(),
            purchaseUnit,
            cnv.convertFromBase({
                value: parseFloat(purchaseQuantity),
                to: purchaseUnit
            }), inventoryUnit,
            cnv.convertFromBase({
                value: parseFloat(inventoryQuantity),
                to: inventoryUnit
            }),
            vendor,
            brand,
            parseFloat(cost)
        )
        await InvLog.create(
            db,
            'bio_materials',
            rawMatId,
            cnv.convertToBase({
                value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity),
                from: inventoryUnit
            }),
            inventoryUnit,
            created_at
        )
        return {invItemId, rawMatId}
    }


    return (
        <Surface style={styles.surfaceMetaContainer}>                        
            <Surface style={styles.surfaceContainer}>
                <Form.Control labelStyle={styles.label} label='Item Name' name='name'>
                    <Form.Input style={{ backgroundColor:'white', width: '100%' }} value={name}  />
                </Form.Control>
                <Form.Control labelStyle={styles.label} label='Item Category' name='category'>
                    <Form.Input style={{ backgroundColor:'white', width: '100%' }} value={category} onChangeText={setCategory}  />
                </Form.Control>
                <Form.Control label='Item Subcategory' labelStyle={styles.label} name='subcategory'>
                    <Form.Input style={{ backgroundColor:'white', width: '100%' }} value={subcategory} onChangeText={setSubcategory}  />
                </Form.Control>
                <Surface style={styles.surface}>
                    <Form.Control name="brand" label="Brand" labelStyle={styles.label} >
                        <Form.Select 
                            style={{ width: '100%', backgroundColor: 'white' }}
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
                    
                </Surface>  
                    
                <Surface style={styles.surface}>
                    <Form.Control labelStyle={styles.label} label="Purchase Quantity" name="purchase_quantity" >
                        <Form.Input
                            value={purchaseQuantity}
                            onChangeText={setPurchaseQuantity} 
                            style={{ width: '50%', backgroundColor: 'white' }}
                            placeholder="Amount" 
                        />
                        <Form.Select
                            style={{ width: '50%', backgroundColor: 'white' }} 
                            options={[...PUR_UNITS]}
                            onValueChange={(value: any) => {
                                setPurchaseUnit(value.value)
                                console.log(value.value)
                            }}
                        />
                    </Form.Control>
                </Surface>
                <Surface style={styles.surface}>
                    <Form.Control labelStyle={styles.label} label="Inventory Quantity" name="inventory_quantity" >
                        <Form.Input
                            value={inventoryQuantity}
                            onChangeText={setInventoryQuantity} 
                            style={{ width: '50%', backgroundColor: 'white' }}
                            placeholder="Amount" 
                        />
                        <Form.Select
                            style={{ width: '50%', backgroundColor: 'white' }} 
                            options={[...INV_UNITS]}
                            onValueChange={(value: any) => {
                                setInventoryUnit(value.value)
                                console.log(value.value)
                            }}
                        />
                    </Form.Control>
                </Surface>  
                <Surface style={styles.surface}>
                    <Form.Input 
                        value={cost}
                        onChangeText={setCost}
                        placeholder="Cost"
                        style={{ backgroundColor: 'white' }} 
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <Form.Control name="vendor" label="Vendor" labelStyle={styles.label}>
                        <Form.Select 
                            style={{ width: '100%', backgroundColor: 'white' }}
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
                </Surface>
                <Surface style={styles.surface}>
                    <Form.Input 
                        value={notes}
                        onChangeText={setNotes}
                        style={{ backgroundColor: 'white' }} 
                        placeholder="Notes"
                    />
                </Surface>
            </Surface>            
            <Button color={'#000000'} title="Submit" onPress={() => handleSubmit()} />
        </Surface>
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
