import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite'
import * as Batch from '@db/recipe-batches/'
import * as Recipe from '@db/recipes/'
import * as Task from '@db/tasks'
import * as Usage from '@db/usage_logs'
import * as Item from '@db/items'
import * as Culture from '@db/cultures'
import { ingredientProps, recipeProps } from '@db/recipes/types'
import { Alert } from 'react-native'
import { convertToBase } from '@utils/unitConversion'
import { PurchaseLogType } from './types'

export async function ExecutePurchaseLog(params: SQLiteDatabase, {
    db,
    recipe_id,
    quantity,
    real_volume,
    real_volume_unit,
    real_weight,
    real_weight_unit,
    loss,
    name,
    batch_notes,
    start_time,
    end_time,
    task_notes,
    usage_notes
} : {
    db: SQLiteDatabase,
    type: PurchaseLogType,
    item_id: number,
    created_at: number,
    purchase_date: number,
    purchase_unit: string,
    purchase_amount: number,
    inventory_unit: string,
    inventory_amount: number,
    vendor_id: number,
    brand_id: number,
    reciept_uri: string,
    cost: number

}) {
    await params.db.withTransactionAsync(async () => {
                
        const created_at = new Date().getTime()
        
        const recipeBatchId = await Batch.create(
            db, 
            recipe_id, 
            quantity, 
            real_volume,
            real_volume_unit,
            real_weight,
            real_weight_unit,
            loss,
            name, 
            batch_notes, 
            created_at
        )
        console.log("Recipe Batch ID: ", recipeBatchId)
        
        const recipe: recipeProps = await Recipe.getById(
            db, 
            recipe_id
        )
        console.log("Recipe: ", recipe)
        
        const ingredients: ingredientProps[] = JSON.parse(recipe.ingredients ?? "[]")
        console.log("Ingredients: ", ingredients)
        
        
        const taskName = `Execute ${quantity * recipe.yield_amount} ${recipe.yield_unit} of ${recipe.name}`
        console.log('Task Name: ', taskName)
        
        const taskId = await Task.create(
            db, 
            taskName, 
            new Date(start_time).getTime(), 
            new Date(end_time).getTime(), 
            task_notes
        )
        console.log('Task ID: ', taskId)

        let usageLogIds: number[] = []


        for (let i = 0; i < ingredients.length; i++) {

            const ingredient: ingredientProps = ingredients[i];
            console.log("Ingredient: ", ingredient)

            const RM = await Item.getById(
                db, 
                ingredient.ingredientId
            )
            console.log("Raw Material Data: ", RM)

            const usageLogId = await Usage.create(
                db,
                RM.type,
                RM.id,
                taskId,
                ingredient.amount,
                ingredient.unit?.toLowerCase() ?? "", 
                usage_notes, 
                created_at 
            ) 
            console.log("Usage Log ID: ", usageLogId)
            usageLogIds.push(usageLogId)   
        }
        return {batch_id: recipeBatchId, task_id: taskId, usage_log_ids: usageLogIds}
    })
}

export async function ExecutePurchaseLogNewItem(params: SQLiteDatabase, {
    db,
    quantity,
    type,
    recipe_batch_id,
    volume_amount,
    volume_unit,
    start_time,
    end_time,
    notes
} : {
    db: SQLiteDatabase,
    quantity: string,
    type: string,
    recipe_batch_id: number,
    volume_amount: string,
    volume_unit: string,
    start_time: number,
    end_time: number,
    notes: string
}) {
    await params.db.withTransactionAsync(async () => {
        
        const qty = parseInt(quantity);
            // const name = 
            if (isNaN(qty) || qty <= 0) {
                Alert.alert('Invalid Quantity', 'Please enter a valid positive number.');
                return;
            }

            const recipe_batch = await Batch.getById(db, recipe_batch_id)
            let usage_log_ids = []
            let task_log_ids = []
    
        const created_at = new Date().getTime()
            try {
                for (let i=0; i<qty; i++) {
    
                    const cultureId = await Culture.create({
                        db, 
                        type, 
                        recipe_batch_id,
                        volume_amount: parseFloat(volume_amount),
                        volume_unit, 
                        last_updated: new Date().getTime(),
                        created_at:  new Date().getTime()
                    });
                    console.log('Using recipebatch ID:', recipe_batch_id);
    
                }                
                const use = convertToBase({value: quantity ? parseInt(quantity) * parseFloat(volume_amount) : parseFloat(volume_amount), from: volume_unit.toLowerCase()})
                console.log(use)
                
                const taskId = await Task.create(db, recipe_batch.name, start_time, end_time, notes)
                console.log(taskId)
                task_log_ids.push(taskId)
                
                const usageId = await Usage.create(db, 'recipe_batch', recipe_batch.id, taskId, use, volume_unit, notes, new Date().getTime() )
                usage_log_ids.push(usageId)
            } catch (error) {
                console.error('Failed to create cultures:', error);
                Alert.alert('Error', 'Failed to create one or more cultures. Please try again.');
            } 
        return {batch_id: recipe_batch.id, task_id: task_log_ids, usage_log_ids: usage_log_ids}
    })
}