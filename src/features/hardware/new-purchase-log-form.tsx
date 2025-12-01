import { useState, useCallback } from "react"
import { Surface,TextInput } from "react-native-paper";
import { StyleSheet, Text, View, ImageBackground, Button, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useEffect } from "react";
import { uploadReceiptToCloudflare } from "../../services/UploadReceiptToCloudflare";
// import UploadReceipt from "../UploadReceipt";
// import CreateVendor from "./CreateVendor";
import * as InvItem from '@db/inventory-items'
import * as ConItem from '@db/consumable-items'
import * as PurchLog from '@db/purchase-logs'
import * as InvLog from '@db/inventory-logs'
import * as Vendor from '@db/vendors'
import * as Brand from '@db/brands'
import * as cnv from '@utils/unitConversion'
import { useSQLiteContext } from "expo-sqlite";
import { Picker } from "@react-native-picker/picker";




export default function NewPurchaseLogForm({
    name,
    category,
    subcategory,
    setName,
    setCategory,
    setSubcategory
} : {
    name?: string,
    category?: string,
    subcategory?: string,
    setName?: (name: string) => void,
    setCategory?: (category: string) => void,
    setSubcategory?: (subcategory: string) => void
}) {

    const navigation = useNavigation();    
    const db = useSQLiteContext();
    const [formVisible, setFormVisible] = useState(false)
    const [pickedImageUri, setPickedImageUri] = useState("")
    const [brand, setBrand] = useState("")
    const [purchaseQuantity, setPurchaseQuantity] = useState("")
    const [purchaseUnit, setPurchaseUnit] = useState("")
    const [inventoryQuantity, setInventoryQuantity] = useState("")
    const [inventoryUnit, setInventoryUnit] = useState("")
    const [cost, setCost] = useState("")
    const [receiptPath, setReceiptPath] = useState("")
    const [notes, setNotes] = useState("")
    const [newBrandName, setNewBrandName] = useState('')

    const [vendor, setVendor] = useState("")

    const [vendors, setVendors] = useState([])
    const [brands, setBrands] = useState([])
    const [newVendor, setNewVendor] = useState(false)
    const [newBrand, setNewBrand] = useState(false)
    const [vendorPhone, setVendorPhone] = useState("")
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorWebsite, setVendorWebsite] = useState("")

    const [image, setImage] = useState(null);
    const [contentType, setContentType] = useState("")
    
    const [receiptMemo, setReceiptMemo] = useState("")
    
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date())
  
      
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
        const invItemId = await InvItem.create(db, 'consumable_item', created_at)
        const conMatId = await ConItem.create(db, invItemId, name, category, subcategory)
        await PurchLog.create(
            db,
            'consumable_item',
            conMatId,
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
            'consumable_item',
            conMatId,
            cnv.convertToBase({
                value: parseFloat(purchaseQuantity) * parseFloat(inventoryQuantity),
                from: inventoryUnit
            }),
            inventoryUnit,
            created_at
        )
        return {invItemId, conMatId}
    }



    return (
        <Surface style={styles.surfaceMetaContainer}>                        
            <Surface style={styles.surfaceContainer}>
                    <Text style={styles.title}>New Purchase Log</Text>        
                    <Text style={styles.subtitle}>(Consumable Supply Items)</Text>        
            </Surface>
            
            <Surface style={styles.surfaceContainer}>
                {name === '' || name === null || name === undefined ? 
                    <Surface style={styles.surface}>
                        <TextInput
                            placeholder="Name"
                            label="Name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                        />
                    </Surface> :
                    <></>
                }
                <Surface style={styles.surface}>
                    <TextInput
                        placeholder="Category"
                        label="category"
                        value={category}
                        onChangeText={setCategory}
                        mode="outlined"
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        placeholder="Subcategory"
                        label="subcategory"
                        value={subcategory}
                        onChangeText={setSubcategory}
                        mode="outlined"
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <Picker 
                        onValueChange={(value: any)=> {
                            if (value.id === 999999) {
                                setBrand(null)
                                setNewBrand(true)
                            } else{
                                setBrand(value)
                                setNewBrand(false)
                            }
                        }}    
                    >
                        {brands.map((b) => {
                            return(
                                <Picker.Item label={b.name} value={{...b}} />
                            )
                        })}
                    </Picker>
                    {newBrand ? 
                        <View>
                            <TextInput
                                label="New Brand Name"
                                value={newBrandName}
                                onChangeText={setNewBrandName}
                                mode="outlined"
                            />
                        </View> :
                        <></>
                    }
                </Surface>      
                    
                <Surface style={[styles.measurementBox, styles.surface]}>
                    <Surface>
                        <TextInput
                            style={[styles.measurementFloatInput]}
                            placeholder="Quantity Purchasing"
                            label="purchaseQuantity"
                            value={purchaseQuantity}
                            onChangeText={setPurchaseQuantity}
                            mode="outlined"
                        />
                    </Surface>
                    <Surface style={{ flex: 1}}>
                        <Picker
                            placeholder="Unit"
                            onValueChange={(value: 'string') => {
                                setPurchaseUnit(value)
                            }}
                        >
                            <Picker.Item label="Unit" value={'unit'} />
                            <Picker.Item label="Bag" value={'bag'} />
                            <Picker.Item label="Case" value={'case'} />
                            <Picker.Item label="Box" value={'box'} />
                            <Picker.Item label="Package" value={'package'} />
                        </Picker>
                    </Surface>
                </Surface>
                <Surface style={[styles.measurementBox, styles.surface]}>
                    <Surface>
                        <TextInput
                            style={[styles.measurementFloatInput]}
                            placeholder="Quantity Inventory"
                            label="inventoryQuantity"
                            value={inventoryQuantity}
                            onChangeText={setInventoryQuantity}
                            mode="outlined"
                        />
                    </Surface>
                    <Surface style={{ flex: 1}}>
                        <Picker
                            placeholder="Unit"
                            onValueChange={(value: 'string') => {
                                setInventoryUnit(value)
                            }}
                        >
                            <Picker.Item label="Unit" value={'unit'} />
                            <Picker.Item label="Grams" value={'gram'} />
                            <Picker.Item label="Kilograms" value={'kilogram'} />
                            <Picker.Item label="milliLiters" value={'milliliter'} />
                            <Picker.Item label="Liters" value={'liter'} />
                            <Picker.Item label="Pounds" value={'pound'} />
                            <Picker.Item label="Ounces" value={'ounce'} />
                            <Picker.Item label="Cups" value={'cup'} />
                            <Picker.Item label="Teaspoons" value={'teaspoon'} />
                            <Picker.Item label="Tablespoons" value={'tablespoon'} />
                        </Picker>
                    </Surface>
                </Surface>  
                <Surface style={styles.surface}>
                    <TextInput
                        placeholder="Cost"
                        label="cost"
                        value={cost}
                        onChangeText={setCost}
                        mode="outlined"
                        style={styles.input}
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <Picker 
                        onValueChange={(value: any)=> {
                            if (value.id === 999999) {
                                setVendor(null)
                                setNewVendor(true)
                            } else{
                                setVendor(value)
                                setNewVendor(false)
                            }
                        }}    
                    >
                        {vendors.map((v) => {
                            return(
                                <Picker.Item label={v.name} value={{...v}} />
                            )
                        })}
                    </Picker>
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        placeholder="Notes"
                        label="notes"
                        value={notes}
                        onChangeText={setNotes}
                        mode="outlined"
                        style={styles.input}
                    />
                </Surface>
            </Surface>
            {/* {newVendor ? (
                <CreateVendor />
            ) : (
                <></>
            )}
            <UploadReceipt
                setImage={setImage}
                setContentType={setContentType}
                setReceiptMemo={setReceiptMemo}
                setPurchaseDatetime={setPurchaseDatetime}
            />             */}
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
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
measurementBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8, // space between inputs (RN 0.71+)
  paddingHorizontal: 8,
},

measurementInput: {
  flex: 1,          // take equal space
  minWidth: 120,    // never smaller than 120px
  maxWidth: 180,    // optional: never bigger than 180px
},

   measurementContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
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
  measurementText: {
    color: "white",
    fontWeight: "bold",
  },
  measurementFloatInput: {
    width: 144
  }
});
