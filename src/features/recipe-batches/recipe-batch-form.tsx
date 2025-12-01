import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import { useCallback, useEffect, useState } from "react";
import { RouteProp, useFocusEffect, useNavigation, usePreventRemove } from "@react-navigation/native";
import { PaperSelect } from "react-native-paper-select";
import { Alert } from "react-native";
import * as RecipeBatch from '@db/recipe-batches'
import * as Recipe from '@db/recipes'
import { useSQLiteContext } from "expo-sqlite";
import { Picker } from "@react-native-picker/picker";
import * as cnv from '@utils/unitConversion'
import * as Usage from '@db/usage_logs'
import * as RawMat from '@db/raw-materials'
import * as Task from '@db/tasks'
import * as InvLog from '@db/inventory-logs'
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { NavigationProps } from "@navigation";


type ingredientProps = {
    ingredientName: string;
    ingredientId: number;
    amount: number;
    unit: string;
}

type recipeProps = {
    id: number;
    name: string;
    type: string;
    ingredients: string;
    yield_amount: number;
    yield_unit: string;
    nute_concentration: number;
    created_at: number;
}

export type RootStackParamList = {
  CreateRecipeBatch: { id: number; startTime?: string; endTime?: string };
  // … other screens …
};

export default function RecipeBatchForm({ setUnsaved }: { setUnsaved: (value: boolean) => void }) {
    const db = useSQLiteContext();
    const { theme } = useTheme()
    const navigation = useNavigation<NavigationProps>();
    type RouteParams = RouteProp<RootStackParamList, 'CreateRecipeBatch'>
    const route = useRoute<RouteParams>()
    const { id, startTime, endTime } = route.params
 
    const [recipe, setRecipe] = useState<recipeProps>({ 
        id: 0,
        name: '',
        type: '', 
        ingredients: '', 
        yield_amount: 0 , 
        yield_unit: '',
        nute_concentration: 0.0, 
        created_at: 0 
    }) 
    const [recipes, setRecipes] = useState<recipeProps[]>([{ 
        id: 0,
        name: '',
        type: '', 
        ingredients: '', 
        yield_amount: 0 , 
        yield_unit: '',
        nute_concentration: 0.0, 
        created_at: 0 
    }])
    const [recipeId, setRecipeId] = useState(0)
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState("")
    const [loss, setLoss] = useState('')
    const [realAmount, setRealAmount] = useState("")
    const [realUnit, setRealUnit] = useState("")
    const [amount, setAmount] = useState("")
    const [unit, setUnit] = useState("")
    const [notes, setNotes] = useState('')


    const getRecipeData = async() => {
        const recipes: any = await Recipe.readAll(db);
        setRecipes(recipes)
    }


    useFocusEffect(
        useCallback(() => {
            getRecipeData()
            console.log(recipes)
            return () => {
                setName('');
                // setType('');
                // setIngredientName('');
                setAmount('');
                setUnit('');
            };
        }, [])
    );

    useEffect(() => {
        const loss_ans = recipe ? ((parseFloat(quantity) * recipe.yield_amount) - parseFloat(realAmount)).toString() : '0'
        let parsed = parseFloat(loss_ans)
        console.log(loss)
        if (parsed < 0) {
            setLoss('0')
        } else {
            setLoss(parsed.toFixed(4).toString())
        }
    }, [recipe, realUnit])

    
    // const handleSubmit = () => {
    //     console.log('Button Pressed!')
    // }
    const handleSubmit = async () => {
        
        const created_at = new Date().getTime()
        
        const recipeBatchId = await RecipeBatch.create(db, recipeId, parseFloat(quantity), parseFloat(realAmount), realUnit, parseFloat(loss), name, notes, created_at)
        
        const recipe: recipeProps = await Recipe.getById(db, recipeId)
        console.log("Recipe: ", recipe)
        
        const ingredients: ingredientProps[] = JSON.parse(recipe.ingredients)
        console.log("Ingredients: ", ingredients)
        
        
        const taskName = `Execute ${parseFloat(quantity) * recipe.yield_amount} ${recipe.yield_unit} of ${recipe.name}`
        console.log('Task Name: ', taskName)
        
        const taskId = await Task.create(db, taskName, new Date(startTime).getTime(), new Date(endTime).getTime(), notes)
        console.log('Task ID: ', taskId)

        for (let i = 0; i < ingredients.length; i++) {

            const ingredient: ingredientProps = ingredients[i];
            console.log("Ingredient: ", ingredient)

            const RM = await RawMat.getById(db, ingredient.ingredientId)
            console.log("Raw Material Data: ", RM)

            const usageLogId = await Usage.create(
                db,
                'bio_material',
                RM.id,
                taskId,
                ingredient.amount,
                ingredient.unit.toLowerCase(), notes, created_at ) 
            console.log("Usage Log ID: ", usageLogId)

            const inventoryLog = await InvLog.getByItemId(db, 'raw_material', RM.id)
            console.log(inventoryLog)


            const baseUsage = (cnv.convertToBase({
                value: inventoryLog.amount_on_hand,
                from: inventoryLog.inventory_unit.toLowerCase()
            }) 
            - cnv.convertToBase({
                value: ingredient.amount,
                from: ingredient.unit.toLowerCase()
            }))
            console.log(baseUsage)

            const use = await InvLog.update(
                db,
                'raw_material',
                inventoryLog.id,
                null,
                baseUsage,
                inventoryLog.inventory_unit,
                created_at
            )


            console.log(use)
            continue
        }   
        // console.log(data)
        // console.log(payload)
        navigation.navigate("Dashboard")
        return recipeBatchId
    }


    return(
        <Surface style={styles.surfaceMetaContainer}>                        
            <Surface style={styles.surfaceContainer}>
                    <Text style={theme.formTitle}>New Batch</Text>        
                    <Text style={theme.formTitle}>From Recipe</Text>        
            </Surface>
            <Surface style={styles.surfaceContainer}>
                <Picker
                    /// selectedValue={item.category}
                    // style={styles.picker}
                    onValueChange={async(value: number) => {
                        // Update the specific pair in state
                        setRecipeId(value);
                        console.log(value)
                        const recipeData: any = await Recipe.getById(db, value)
                        setRecipe(recipeData)
                    }}
                
                >
                    {recipes.map((recipe) => {
                        return(
                            <Picker.Item label={`${recipe.name}, ${recipe.yield_amount} ${recipe.yield_unit}`} value={recipe.id} />
                            // <Picker.Item label={recipe.name} value={recipe.id}/>
                        )
                    })}
                </Picker>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Batch Name"
                        value={
                            recipe ?
                            `${recipe.nute_concentration ?
                            `${recipe.nute_concentration*100}% ${recipe.name} Batch ${
                                quantity ?
                                    parseFloat(quantity) * recipe.yield_amount :
                                    recipe.yield_amount
                                } ${recipe.yield_unit}` : 
                                `${recipe.name} Batch ${
                                quantity ?
                                    parseFloat(quantity) * recipe.yield_amount :
                                    recipe.yield_amount
                                } ${recipe.yield_unit}`} ` : null}
                        onChangeText={(value) => setName(value)}
                        mode="outlined"
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Quantity of Recipe"
                        value={quantity}
                        onChangeText={setQuantity}
                        mode="outlined"
                    />
                </Surface>
                <Surface style={styles.surfaceContainer}>
                    <Surface style={styles.surface}>
                        <Text style={styles.subtitle}>
                            Real Yield
                        </Text>
                    </Surface>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TextInput
                            label="Amount"
                            value={realAmount}
                            onChangeText={setRealAmount}
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                        <TextInput
                            label="Unit"
                            value={realUnit}
                            onChangeText={setRealUnit}
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                    </View>
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Loss"
                        value={loss}
                        // onChangeText={setLoss}
                        mode="outlined"
                        style={{ flex: 1 }}
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Batch Notes"
                        value={notes}
                        onChangeText={setNotes}
                        mode="outlined"
                        style={{ flex: 1 }}
                    />
                </Surface>
                <Button  color={'#000000'} title="Submit" onPress={() => handleSubmit()} />

            </Surface>    
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
    paddingBottom: 32,
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