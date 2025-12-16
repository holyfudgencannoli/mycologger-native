import { SQLiteDatabase, useSQLiteContext } from 'expo-sqlite'
import * as Batch from '@db/recipe-batches/'
import * as BatchLog from '@db/recipe-batch-inventory-logs/'
import * as Recipe from '@db/recipes/'
import * as Task from './queries'
import * as Usage from '@db/usage_logs'
import * as Item from '@db/items'
import * as Culture from '@db/cultures'
import { ingredientProps, recipeProps } from '@db/recipes/types'
import { Alert } from 'react-native'
import { convertToBase } from '@utils/unitConversion'
import * as cnv from '@utils/unitConversion'
import { RecipeBatchInventoryLog } from '@db/recipe-batch-inventory-logs/types'


export async function ExecuteRecipe(params: any, {
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
    recipe_id: number,
    quantity: number,
    real_volume: number,
    real_volume_unit: string,
    real_weight: number,
    real_weight_unit: string,
    loss: number,
    name: string,
    batch_notes: string,
    start_time: string,
    end_time: string,
    task_notes: string,
    usage_notes: string,

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

        const batchLogId = await BatchLog.create(
                db,
                recipeBatchId,
                quantity * real_volume,
                real_volume_unit,
                0,
                created_at
            )

        console.log("Recipe Batch Inventory Log ID: ", batchLogId)

        
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
            console.log('1234: ', RM.amount_on_hand)
            console.log('1234: ', RM.inventory_unit)
            console.log('1234: ', ingredient.amount)
            console.log('1234: ', ingredient.unit)
            let one = cnv.convertToBase({ value: RM.amount_on_hand, from: RM.inventory_unit  }) 
            let two = quantity * cnv.convertToBase({ value: ingredient.amount, from: ingredient.unit })
            console.log('1: ', one)
            console.log('2: ', two)
            
            let Amount = cnv.convertFromBase({

                value: 
                    (one - two),
                to: 
                    RM.inventory_unit
            })
            let Unit = RM.inventory_unit

            await Item.update(
                db, 
                {
                    id: RM.id,
                    amount_on_hand: Amount,
                    inventory_unit: Unit,
                    last_updated: created_at
                    
                })
            
            console.log("Usage Log ID: ", usageLogId)
            console.log(Amount)
            usageLogIds.push(usageLogId)   
        }
        return {batch_id: recipeBatchId, task_id: taskId, usage_log_ids: usageLogIds}
    })
}

export async function ExecuteAgar(params: any, {
    db,
    quantity,
    type,
    recipe_batch_id,
    volume_amount,
    volume_unit,
    usage_amount,
    usage_unit,
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
    usage_amount: string,
    usage_unit: string,
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
            let batch_log: RecipeBatchInventoryLog = await BatchLog.getByBatchId(db, recipe_batch_id)
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
                const use = quantity ? parseInt(quantity) * parseFloat(volume_amount) : parseFloat(volume_amount)
                console.log(use)
                
                const taskId = await Task.create(db, recipe_batch.name, start_time, end_time, notes)
                console.log(taskId)
                task_log_ids.push(taskId)
                
            
            const usageLogId = await Usage.create(
                db,
                'recipe_batch',
                recipe_batch.id,
                taskId,
                parseFloat(usage_amount),
                usage_unit?.toLowerCase() ?? "", 
                notes, 
                created_at 
            ) 
                let one = cnv.convertToBase({ value: batch_log.amount_on_hand, from: batch_log.inventory_unit })
                let two = cnv.convertToBase({ value: parseFloat(usage_amount), from: usage_unit })
                
                let Amount = cnv.convertFromBase({

                    value: 
                        one - two,
                    to: 
                        batch_log.inventory_unit
                })
                let Unit = batch_log.inventory_unit

                await BatchLog.update(
                    db, 
                    {
                        id: batch_log.id,
                        amount_on_hand: Amount,
                        inventory_unit: Unit,
                        last_updated: created_at
                        
                    })
                
                console.log("Usage Log ID: ", usageLogId)
                usage_log_ids.push(usageLogId)
            } catch (error) {
                console.error('Failed to create cultures:', error);
                Alert.alert('Error', 'Failed to create one or more cultures. Please try again.');
            } 
        return {batch_id: recipe_batch.id, task_id: task_log_ids, usage_log_ids: usage_log_ids}
    })
}