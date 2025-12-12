import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite'
import * as PurchLog from '@db/purchase-logs'
import * as Recipe from '@db/recipes/'
import * as Vendor from '@db/vendors'
import * as Brand from '@db/brands'
import * as Task from '@db/tasks'
import * as Usage from '@db/usage_logs'
import * as Item from '@db/items'
import * as Culture from '@db/cultures'
import { ingredientProps, recipeProps } from '@db/recipes/types'
import { Alert } from 'react-native'
import { convertToBase } from '@utils/unitConversion'
import { PurchaseLogType } from './types'
import { VendorType } from '@db/vendors'
import BrandType from '@features/brands/type'
import { Item as ItemType } from '@db/items/types'
import * as cnv from '@utils/unitConversion'
import { saveReceiptWithSAF } from '@utils/database-utils'
import { SQLiteAnyDatabase } from 'node_modules/expo-sqlite/build/NativeSession'


export async function ExecutePurchaseLog(params: SQLiteAnyDatabase, {
    db,
    type,
    item_id,
    purchase_date,
    purchase_unit,
    purchase_amount,
    inventory_unit,
    inventory_amount,
    vendor_id,
    brand_id,
    reciept_uri,
    cost,
    new_brand,
    new_vendor,
    new_item,
    image
} : {
    db: SQLiteDatabase,
    type: PurchaseLogType,
    item_id?: number,
    purchase_date: number,
    purchase_unit: string,
    purchase_amount: number,
    inventory_unit: string,
    inventory_amount: number,
    vendor_id?: number,
    brand_id?: number,
    reciept_uri?: string,
    cost: number,
    new_vendor?: VendorType,
    new_brand?: BrandType,
    new_item?: ItemType,
    image?: string

}) {
    await params.db.withTransactionAsync(async () => {
                
        const created_at = new Date().getTime()



        let currentVendorId: number;
        let currentBrandId: number;

        if (new_vendor) {
            const new_vendor_id = await Vendor.create(
                db,
                new_vendor.name,
                new_vendor.email,
                new_vendor.phone,
                new_vendor.address,
                new_vendor.contact_name,
                new_vendor.website,
                created_at
            )
            currentVendorId = new_vendor_id

        } else {
            currentVendorId = vendor_id
        }
        console.log("Vendor ID: ", currentVendorId)

        if (new_brand) {
            const new_brand_id = await Brand.create(
                db,
                item_id,
                new_brand.name,
                new_brand.website,
                created_at
            )
            currentBrandId = new_brand_id
        } else {
            currentBrandId = brand_id
        }
        console.log("Brand ID: ", currentVendorId)

        let currentItemId: number;

        if (new_item) {
            const new_item_id = await Item.create(
                db,
                new_item.name,
                new_item.category,
                new_item.subcategory,
                new_item.type,
                created_at,
                cnv.convertFromBase({
                    value: 
                        cnv.convertToBase({ value: new_item.amount_on_hand, from: new_item.inventory_unit === null ? 'gram' : new_item.inventory_unit }) || 0 
                        + cnv.convertToBase({ value: purchase_amount * inventory_amount, from: inventory_unit }),
                    to: 
                        inventory_unit
                }),
                inventory_unit,
                0,
                created_at,
                0,
                inventory_unit
            )
            currentItemId = new_item_id
        } else {
            currentItemId = item_id
        }

        console.log("Item ID: ", currentItemId)

        let targetUri: string;

        if (!reciept_uri) {    
            targetUri = await saveReceiptWithSAF(image, `receipt_image_${created_at}.jpeg`)
        } else {
            targetUri = reciept_uri
        }

        console.log("Image URI: ", targetUri)

        const purchLogId = await PurchLog.create(
            db,
            type,
            currentItemId,
            created_at,
            purchase_date,
            purchase_unit,
            purchase_amount,
            inventory_unit,
            inventory_amount,
            currentVendorId,
            currentBrandId,
            targetUri,
            cost
        )
        console.log("Purchase Log ID: ", purchLogId)

    })
}
