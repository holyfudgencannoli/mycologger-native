import { useState } from "react";
import { FormStateContext } from "./FormContext";

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
    
    const [id, setId] = useState<number | null>(null);
    const [vendorId, setVendorId] = useState<number | null>(null);
    const [brandId, setBrandId] = useState<number | null>(null);

    const [vendors, setVendors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [newVendor, setNewVendor] = useState(false);
    const [vendorPhone, setVendorPhone] = useState("");
    const [vendorEmail, setVendorEmail] = useState("");
    const [vendorWebsite, setVendorWebsite] = useState("");

    const [image, setImage] = useState(null);
    const [contentType, setContentType] = useState("");
    const [isNew, setIsNew] = useState(false)

    const [receiptMemo, setReceiptMemo] = useState("");
    const [purchaseDatetime, setPurchaseDatetime] = useState(new Date());
    
    const [selectedRecipeBatchId, setSelectedRecipeBatchId] = useState(0)
    const [selectedRecipeBatchName, setSelectedRecipeBatchName] = useState("")

    
    const value = {
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
        vendors, setVendors,
        brands, setBrands,
        newVendor, setNewVendor,
        vendorPhone, setVendorPhone,
        vendorEmail, setVendorEmail,
        vendorWebsite, setVendorWebsite,
        image, setImage,
        contentType, setContentType,
        receiptMemo, setReceiptMemo,
        purchaseDatetime, setPurchaseDatetime
    };

    return (
        <FormStateContext.Provider value={value}>
            {children}
        </FormStateContext.Provider>
    );
}
