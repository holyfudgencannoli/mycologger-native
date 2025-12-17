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
import {default as BrandType} from "@features/brands/type";
import { NewBrandFormState, NewVendorFormState } from "src/context/FormState";
import { FORM } from "@constants/styles";

type NavigationProps = DrawerNavigationProp<RootDrawerParamsList>



const NEW_ID = 999_999;   // value used by the picker for “New …”
const SELF_ID = 0;        // value used by the picker for “Self”



/**
 * Show an alert and return true if we should abort the submit flow.
 */
function abortWithAlert(title: string, message: string): boolean {
  Alert.alert(title, message);
  return true;
}

/**
 * Check if a name already exists in a list of objects that have a `name` field.
 */
function isDuplicateName<T extends { name: string }>(
  items: T[],
  nameToCheck: string
): boolean {
  return items.some((item) => item.name.toLowerCase() === nameToCheck.trim().toLowerCase());
}

/**
 * Convert purchase + inventory quantities into the unit used by the item.
 */
function calculateAmount(
  baseUnit: string,
  purchaseQty: number,
  inventoryQty: number,
  inventoryUnit: string
): { amount: number; unit: string } {
  const raw = purchaseQty * inventoryQty;
  // If we already have an inventory unit, convert to that unit.
  if (baseUnit) {
    return {
      amount: cnv.convertFromBase({
        value: cnv.convertToBase({ value: raw, from: inventoryUnit }),
        to: baseUnit,
      }),
      unit: baseUnit,
    };
  }
  // No existing unit – keep the inventory unit.
  return { amount: raw, unit: inventoryUnit };
}

/**
 * Persist a brand if it is new; otherwise just return its id.
 */
async function getOrCreateBrand(
  db: any,
  state: NewBrandFormState,
  currentId?: number
): Promise<number> {
  if (currentId && currentId !== NEW_ID && currentId !== SELF_ID) return currentId;

  // New brand – create it in the DB.
  const brandId = await Brand.create(
    db,
    state.brandName,
    state.brandWebsite,
    Date.now()
  );
  return brandId;
}

/**
 * Persist a vendor if it is new; otherwise just return its id.
 */
async function getOrCreateVendor(
  db: any,
  state: NewVendorFormState,
  currentId?: number
): Promise<number> {
  if (currentId && currentId !== NEW_ID && currentId !== SELF_ID) return currentId;

  const vendorId = await Vendor.create(
    db,
    state.name,
    state.email,
    state.phone,
    state.address,
    state.contactName,
    state.website,
    Date.now()
  );
  return vendorId;
}


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

    const { id, setId,
        image,
        brand, setBrand,
        vendor, setVendor,
        item, setItem,
        isNew, setIsNew,
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
        setVendors([{id: 999999, name: 'New Vendor'}, {id: 0, name: 'Self'}, ...vendor_rows])
        return vendor_rows
    }

    async function getBrands() {
        const brand_rows = await Brand.readAll(db)
        setBrands([{id: 999999, name: 'New Brand'}, {id: 0, name: 'Self'}, ...brand_rows])
        return brand_rows
    }

    useFocusEffect(
        useCallback(() => {
            getData()
            getVendors()
            getBrands()
            console.log(
                image,
                brand, 
                vendor,
                item, 
                isNew,
                name, 
                category,
                subcategory,
                purchaseQuantity,
                purchaseUnit,
                inventoryQuantity,
                inventoryUnit,
                cost,
                notes,
                vendorId
            )
            return() => {
                setId(null)
                setVendor(null)
                setBrand(null)
                setIsNew(false)
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
				/* ---------- 1. Validation ---------- */
				if (!image) return abortWithAlert("Error", "Please select a receipt image");

				// Duplicate checks – only run when creating new entities.
				if (isNew && isDuplicateName(items, name))
					return abortWithAlert("Duplicate Item Creation", "Item Already Exists!");

				if (newBrand && isDuplicateName(brands, brandState.brandName))
					return abortWithAlert("Duplicate Brand Creation", "Brand Already Exists!");

				if (newVendor && isDuplicateName(vendors, vendorState.name))
					return abortWithAlert("Duplicate Vendor Creation", "Vendor Already Exists!");

				/* ---------- 2. Resolve IDs ---------- */
				const createdAt = Date.now();
				const type = CaseHelper.toSnakeCase(decodeURIComponent(path.split("/")[2])).slice(0, -1);

				// Brand & Vendor – create if needed.
				const brandId = await getOrCreateBrand(db, brandState, brand?.id);
				const vendorId = await getOrCreateVendor(db, vendorState, vendor?.id);

				/* ---------- 3. Item handling ---------- */
				let itemId: number | undefined;
				let amountOnHand: number;
				let inventoryUnitUsed: string;

				if (id !== null && id !== 999999) {
					// Existing item – update its quantity.
					const existing = await Item.getById(db, id);

					const { amount, unit } = calculateAmount(
						existing.inventory_unit ?? "",
						parseFloat(purchaseQuantity),
						parseFloat(inventoryQuantity),
						inventoryUnit
					);

					await Item.update(db, {
						id,
						amount_on_hand: amount,
						inventory_unit: unit,
						last_updated: createdAt,
					});

					itemId = id;
					amountOnHand = amount;
					inventoryUnitUsed = unit;
				} else if (isNew) {
					// New item – create it.
					const { amount, unit } = calculateAmount(
						"",
						parseFloat(purchaseQuantity),
						parseFloat(inventoryQuantity),
						inventoryUnit
					);

					itemId = await Item.create(
						db,
						name,
						category,
						subcategory,
						type,
						createdAt,
						amount,
						unit,
						0, // TODO: decide what this field is
						createdAt,
						0,
						unit
					);
					amountOnHand = amount;
					inventoryUnitUsed = unit;
				}

				/* ---------- 4. Persist receipt image ---------- */
				const receiptPath = await saveReceiptWithSAF(image, `receipt_image_${createdAt}`);

				/* ---------- 5. Create purchase log ---------- */
				await PurchLog.create(
					db,
					type,
					itemId!,
					createdAt,
					purchaseDatetime.getTime(),
					purchaseUnit,
					parseFloat(purchaseQuantity),
					inventoryUnit,
					parseFloat(inventoryQuantity),
					vendor?.id ?? null, // original vendor id (may be 0 for “Self”)
					brandId,
					receiptPath,
					parseFloat(cost)
				);

				/* ---------- 6. Success & navigation ---------- */
				navigation.navigate("Dashboard");
				console.log(
					`Success! ${purchaseQuantity} ${purchaseUnit} of ${CaseHelper.toCleanCase(type)} ${name} added to your inventory. Great Work!`
				);
			} catch (error) {
				console.error(error);
				Alert.alert("Unexpected error", "Something went wrong while saving the purchase log.");
			}
		};

    return (
        <>
            {
                isNew ?
                <Form.Control labelStyle={FORM.LABEL} label='Item Name' name='name'>
                    <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={name} onChangeText={setName}  />
                </Form.Control> :
                <></>
            }
            <Form.Control labelStyle={FORM.LABEL} label='Item Category' name='category'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={isNew ? category : item.category} onChangeText={isNew ? setCategory : null}  />
            </Form.Control>
            <Form.Control label='Item Subcategory' labelStyle={FORM.LABEL} name='subcategory'>
                <Form.Input style={{ backgroundColor:'transparent', width: '100%' }} value={isNew ? subcategory : item.subcategory} onChangeText={isNew ? setSubcategory : null}  />
            </Form.Control>
            <Form.Control name="brand" label="Brand" labelStyle={FORM.LABEL} >
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
            <Form.Control labelStyle={FORM.LABEL} label="Purchase Quantity" name="purchase_quantity" >
                <Form.Input
                    value={purchaseQuantity}
                    onChangeText={setPurchaseQuantity} 
                    style={{ width: '50%', backgroundColor: 'transparent', color: 'white' }}
                />
                <Form.Select
                    style={{ width: '50%', backgroundColor: 'transparent' }} 
                    placeholder="Select Unit"
                    options={[...PUR_UNITS]}
                    onValueChange={(value: any) => {
                        setPurchaseUnit(value.value)
                        console.log(value.value)
                    }}
                />
            </Form.Control>
            <Form.Control labelStyle={FORM.LABEL} label="Inventory Quantity" name="inventory_quantity" >
                <Form.Input
                    value={inventoryQuantity}
                    onChangeText={setInventoryQuantity} 
                    style={{ width: '50%', backgroundColor: 'transparent' }}
                />
                <Form.Select
                    style={{ width: '50%', backgroundColor: 'transparent' }} 
                    placeholder="Select Unit"
                    options={[...INV_UNITS]}
                    onValueChange={(value: any) => {
                        setInventoryUnit(value.value)
                        console.log(value.value)
                    }}
                />
            </Form.Control>
            <Form.Control labelStyle={FORM.LABEL} label="Cost" name="cost" >
                <Form.Input 
                    value={cost}
                    onChangeText={setCost}
                     style={{ backgroundColor: 'transparent', width: '100%' }} 
                />
            </Form.Control>
            <Form.Control name="vendor" label="Vendor" labelStyle={FORM.LABEL}>
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
            <Form.Control name="notes" label="Notes" labelStyle={FORM.LABEL}>
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



  // item: {
  //   width: "30%",        // 3 items per row
  //   aspectRatio: 1,      // makes it square
  //   marginBottom: 10,
  //   backgroundColor: "#4682B4",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   borderRadius: 8,
  // },