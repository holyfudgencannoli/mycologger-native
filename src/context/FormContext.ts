import { createContext, useState } from "react";
import { FormState, NewBrandFormState, NewVendorFormState } from "./FormState";
    import { Item } from "@db/items/types";
    import { VendorType } from "@db/vendors";
    import Brand from "@features/brands/type";
    import React from "react";


export const FormStateContext = createContext<FormState>({
    type: '',
    setType: () => {},
    selectedRecipeBatchId: 0,
    setSelectedRecipeBatchId: () => {},
    selectedRecipeBatchName: '',
    setSelectedRecipeBatchName: () => {},
    nuteConcentration: '', 
    setNuteConcentration: () => {},
    isNew: false,
    setIsNew: () => {},
    selectedItem: null,
    setSelectedItem: () => {},
    id: null,
    setId: () => {},
    name: "", 
    setName: (name: string) => {},
    category: "", 
    setCategory: () => {},
    subcategory: "", 
    setSubcategory: () => {},
    item: null,
    setItem: () => {},
    items: [],
    setItems: () => {},
    itemId: 0,
    setItemId: () => {},
    formVisible: false,
    setFormVisible: () => {},
    pickedImageUri: "",
    setPickedImageUri: () => {},
    brand: null, 
    setBrand: () => {},
    newBrand: false,
    setNewBrand: () => {},
    purchaseQuantity: "",
    setPurchaseQuantity: () => {},
    purchaseUnit: "",
    setPurchaseUnit: () => {},
    inventoryQuantity: "",
    setInventoryQuantity: () => {},
    inventoryUnit: "",
    setInventoryUnit: () => {},
    cost: "", 
    setCost: () => {},
    receiptPath: "",
    setReceiptPath: () => {},
    notes: "", 
    setNotes: () => {},
    vendorId: 0,
    setVendorId: () => {},
    brandId: 0,
    setBrandId: () => {},
    vendor: null,
    setVendor: () => {},
    vendors: null,
    setVendors: () => {},
    brands: null, 
    setBrands: () => {},
    newVendor: false,
    setNewVendor: () => {},
    image: null, 
    setImage: () => {},
    images: [], 
    setImages: () => {},
    contentType: "",
    setContentType: () => {},
    receiptMemo: "",
    setReceiptMemo: () => {},
    purchaseDatetime: new Date(),
    setPurchaseDatetime: () => {}
    
});

export const BrandFormStateContext = createContext<NewBrandFormState>({
    brandName: "",
    setBrandName: (text: string) => {},
    brandWebsite: "",
    setBrandWebsite: (text: string) => {},
    


});

export const VendorFormStateContext = createContext<NewVendorFormState>({
    phone: "",
    setPhone: (text: string) => {},
    email: "",
    setEmail: (text: string) => {},
    website: "",
    setWebsite: (text: string) => {},
    name: "",
    setName: (text: string) => {},
    address: "",
    setAddress: (text: string) => {},
    contactName: "",
    setContactName: (text: string) => {},
})
