import { useState } from "react";
import { BrandFormStateContext, FormStateContext, RecipeBatchFormStateContext, VendorFormStateContext } from "./FormContext";
import { FormState, NewBrandFormState, NewVendorFormState } from "./FormState";
import { VendorType } from "@db/vendors";

export function VendorFormStateProvider({ children }) {
    const [name, setName] = useState("");
    const [contactName, setContactName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    
    const vendorValue = {
        name, setName,
        contactName, setContactName,
        address, setAddress,
        phone, setPhone,
        email, setEmail,
        website, setWebsite,
        
    } satisfies NewVendorFormState


    return(
        <VendorFormStateContext.Provider value={vendorValue}>
            {children}
        </VendorFormStateContext.Provider>
    )

};

export function BrandFormStateProvider({ children }) {
    const [brandName, setBrandName] = useState("");
    const [brandWebsite, setBrandWebsite] = useState("");


    const brandValue = {
        brandName, setBrandName,
        brandWebsite, setBrandWebsite
    } satisfies NewBrandFormState

    
    return(
        <BrandFormStateContext.Provider value={brandValue}>
            {children}
        </BrandFormStateContext.Provider>
    )
    
};

export function FormStateProvider({ children }) {
    const [selectedItem, setSelectedItem] = useState(null)
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [item, setItem] = useState();
    const [items, setItems] = useState([]);
    const [itemId, setItemId] = useState();
    const [formVisible, setFormVisible] = useState(false);
    const [pickedImageUri, setPickedImageUri] = useState("");
    const [brand, setBrand] = useState("");
    const [newBrand, setNewBrand] = useState(false);
    const [purchaseQuantity, setPurchaseQuantity] = useState("");
    const [purchaseUnit, setPurchaseUnit] = useState("");
    const [inventoryQuantity, setInventoryQuantity] = useState("");
    const [inventoryUnit, setInventoryUnit] = useState("");
    const [cost, setCost] = useState("");
    const [receiptPath, setReceiptPath] = useState("");
    const [notes, setNotes] = useState("");
    
    const [nuteConcentration, setNuteConcentration] = useState<string | null>(null);
    
    const [type, setType] = useState<string | null>(null);
    const [id, setId] = useState<number | null>(null);
    const [vendorId, setVendorId] = useState<number | null>(null);
    const [brandId, setBrandId] = useState<number | null>(null);

    const [vendors, setVendors] = useState<VendorType[]>([]);
    const [vendor, setVendor] = useState<VendorType>();
    const [brands, setBrands] = useState([]);
    const [newVendor, setNewVendor] = useState(false);
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);
    const [contentType, setContentType] = useState("");
    const [isNew, setIsNew] = useState(false)

    const [receiptMemo, setReceiptMemo] = useState("");
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date());
    
    const [selectedRecipeBatchId, setSelectedRecipeBatchId] = useState(0)
    const [selectedRecipeBatchName, setSelectedRecipeBatchName] = useState("")

    
    const value = {
        type, setType,
        selectedRecipeBatchId, setSelectedRecipeBatchId,
        selectedRecipeBatchName, setSelectedRecipeBatchName,
        nuteConcentration, setNuteConcentration,
        isNew, setIsNew,
        id, setId,
        selectedItem, setSelectedItem,
        name, setName,
        category, setCategory,
        subcategory, setSubcategory,
        item, setItem,
        items, setItems,
        itemId, setItemId,
        formVisible, setFormVisible,
        pickedImageUri, setPickedImageUri,
        brand, setBrand,
        newBrand, setNewBrand,
        purchaseQuantity, setPurchaseQuantity,
        purchaseUnit, setPurchaseUnit,
        inventoryQuantity, setInventoryQuantity,
        inventoryUnit, setInventoryUnit,
        cost, setCost,
        receiptPath, setReceiptPath,
        notes, setNotes,
        vendorId, setVendorId,
        brandId, setBrandId,
        vendor, setVendor,
        vendors, setVendors,
        brands, setBrands,
        newVendor, setNewVendor,
        image, setImage,
        images, setImages,
        contentType, setContentType,
        receiptMemo, setReceiptMemo,
        purchaseDatetime, setPurchaseDatetime
    } satisfies FormState


    return (
        <VendorFormStateProvider>
            <BrandFormStateProvider>
                <RecipeBatchFormStateProvider>
                    <FormStateContext.Provider value={value}>
                        {children}
                    </FormStateContext.Provider>    
                </RecipeBatchFormStateProvider>
            </BrandFormStateProvider>
        </VendorFormStateProvider>

    );
}

export function RecipeBatchFormStateProvider({ children }) {
    const [recipeId, setRecipeId] = useState(0);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [realWeightAmount, setRealWeightAmount] = useState("");
    const [realWeightUnit, setRealWeightUnit] = useState("");
    const [realVolume, setRealVolume] = useState("");
    const [realVolumeUnit, setRealVolumeUnit] = useState("");
    const [loss, setLoss] = useState("");
    const [notes, setNotes] = useState("");

    const value = {
        recipeId, setRecipeId,
        name, setName,
        quantity, setQuantity,
        realWeightAmount, setRealWeightAmount,
        realWeightUnit, setRealWeightUnit,
        realVolume, setRealVolume,
        realVolumeUnit, setRealVolumeUnit,
        loss, setLoss,
        notes, setNotes
    }

    return(
        <RecipeBatchFormStateContext.Provider value={value}>
            {children}
        </RecipeBatchFormStateContext.Provider>
)}


