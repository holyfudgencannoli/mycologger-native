import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import { useTheme } from "@hooks/useTheme";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation, usePreventRemove } from "@react-navigation/native";
import { PaperSelect } from "react-native-paper-select";
import { Alert } from "react-native";
import * as Recipe from '@db/recipes'
import * as RawMat from '@db/raw-materials'
import { useSQLiteContext } from "expo-sqlite";
import * as cnv from '@utils/unitConversion'
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NavigationProps, RootDrawerParamsList } from "@navigation";


type ingredientProps = {
    ingredientName: string;
    ingredientId: number;
    amount: number;
    unit: string;
}

export default function CreateRecipe({ setUnsaved }: { setUnsaved: (value: boolean) => void }) {
    const db = useSQLiteContext();
    const { theme } = useTheme()
    const navigation = useNavigation<NavigationProps>();
 
    const [name, setName] = useState("")
    const [type, setType] = useState("")
    const [yieldAmount, setYieldAmount] = useState("")
    const [yieldUnit, setYieldUnit] = useState('')
    const [ingredientName, setIngredientName] = useState("")
    const [ingredientId, setIngredientId] = useState(0)
    const [amount, setAmount] = useState("")
    const [unit, setUnit] = useState("")
    const [ingredients, setIngredients] = useState<ingredientProps[]>([])
    const [rawMaterialNames, setRawMaterialNames] = useState([])

    const addIngredient = (name: string, ingredientId: number, amount: string, unit: string) => {
        const ingredient = {
            'ingredientName': name,
            'ingredientId': ingredientId,
            'amount': cnv
                .convertToBase({
                    value: (parseFloat(amount)),
                    from: unit.toLowerCase(),
                }),
            'unit': unit
        }
        console.log(ingredient)
        setIngredients((prev) => [...prev, ingredient])
        setIngredientName('')
        setAmount('')
        setUnit('')
    }

    useEffect(() => {
        const hasChanges = name.trim() !== "" || type.trim() !== "" || ingredients.length > 0;
        setUnsaved(hasChanges);
    }, [name, type, ingredientName, amount, unit, ingredients]);



    const getRMData = async () => {
        const items: any = await RawMat.readAll(db)
        const formatted = items.map((item, index) => ({
            _id: String(index),
            id: item.id,
            value: item.name,
        }));
        console.log("Formatted: ", formatted)
        setRawMaterialNames(formatted);
    };


    useFocusEffect(
        useCallback(() => {
            getRMData()
            console.log(rawMaterialNames)
            return () => {
                setName('');
                setType('');
                setIngredientName('');
                setAmount('');
                setUnit('');
                setIngredients([]);
            };
        }, [])
    );


    
    const handleSubmit = async () => {
        if (ingredients.length === 0 || name === '' || type === '' || yieldAmount === '' || yieldUnit === '') {
            Alert.alert('Make sure you fill out all fields')
        } else {
            try {
                const created_at = new Date().getTime()
                const recipeId = await Recipe.create(db, name, type, ingredients, parseInt(yieldAmount), yieldUnit.toLowerCase(), 0.02, created_at) 
                console.log(ingredients)
                navigation.navigate("Dashboard")
                return recipeId        
            } catch (error) {
                
                console.error(error)
            }
            // console.log(data)
            // console.log(payload)
        }
    }


    return(
        <Surface style={styles.surfaceMetaContainer}>                        
            <Surface style={styles.surfaceContainer}>
                    <Text style={theme.formTitle}>New Recipe</Text>        
            </Surface>
            <Surface style={styles.surfaceContainer}>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Recipe Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        
                    />
                </Surface>
                <Surface style={styles.surface}>
                    <TextInput
                        label="Recipe Type"
                        value={type}
                        onChangeText={setType}
                        mode="outlined"
                    />
                </Surface>
                <Surface style={styles.surfaceContainer}>
                    <Surface style={styles.surface}>
                        <Text style={styles.subtitle}>
                            Yield
                        </Text>
                    </Surface>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <TextInput
                            label="Amount"
                            value={yieldAmount}
                            onChangeText={setYieldAmount}
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                        <TextInput
                            label="Unit"
                            value={yieldUnit}
                            onChangeText={setYieldUnit}
                            mode="outlined"
                            style={{ flex: 1 }}
                        />
                    </View>
                </Surface>
                <Surface style={styles.surface}>
                    <PaperSelect
                        label="Select Ingredient"
                        value={ingredientName}
                        onSelection={(value: any) => {
                            const selected = value.selectedList[0];
                            if (selected) {
                                setIngredientName(selected.value);
                                setIngredientId(selected.id);
                            }
                        }}

                        arrayList={rawMaterialNames}
                        selectedArrayList={[]}
                        multiEnable={false}
                        hideSearchBox={false}
                        textInputMode="outlined"
                    />
                    <Surface style={styles.surfaceContainer}>
                        <Surface style={styles.surface}>
                            <Text style={styles.subtitle}>
                                Yield
                            </Text>
                        </Surface>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TextInput
                                label="Amount"
                                value={amount}
                                onChangeText={setAmount}
                                mode="outlined"
                                style={{ flex: 1 }}
                            />
                            <TextInput
                                label="Unit"
                                value={unit}
                                onChangeText={setUnit}
                                mode="outlined"
                                style={{ flex: 1 }}
                            />
                        </View>
                    </Surface>
                    <Button  color={'#000000'} title="Add Recipe Item" onPress={() => addIngredient(ingredientName, ingredientId, amount, unit)} />

                </Surface>
                <View>
                    {ingredients.map((ingredient, index) => {
                        return(
                            <Text key={index} style={styles.subtitle}>
                                {ingredient.ingredientName} — {
                                    cnv.convertFromBase({
                                        value: ingredient.amount,
                                        to: ingredient.unit.toLowerCase()
                                    })
                                } {ingredient.unit}
                            </Text>
                        )
                        
                    })}
                </View>
                <Text>
                    
                </Text>
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