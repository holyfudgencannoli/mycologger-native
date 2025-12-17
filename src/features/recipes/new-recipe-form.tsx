import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import { useTheme } from "@hooks/useTheme";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFocusEffect, useNavigation, usePreventRemove } from "@react-navigation/native";
import { PaperSelect } from "react-native-paper-select";
import { Alert } from "react-native";
import * as Recipe from '@db/recipes'
import * as Item from '@db/items'
import { useSQLiteContext } from "expo-sqlite";
import * as cnv from '@utils/unitConversion'
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { NavigationProps, RootDrawerParamsList } from "@navigation/types";
import * as Form from '@custom/react-native-forms/src'
import { INV_UNITS } from "@constants/units";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { FormStateContext } from "src/context/FormContext";
import { FORM } from "@constants/styles";


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
    const { nuteConcentration, setNuteConcentration } = useContext(FormStateContext)
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
            'amount': parseFloat(amount),
            'unit': unit 
        }
        console.log(ingredient)
        setIngredients((prev) => [...prev, ingredient])
        setIngredientName(null)
        setAmount('')
        setUnit(null)
    }

    // useEffect(() => {
    //     const hasChanges = name.trim() !== "" || type.trim() !== "" || ingredients.length > 0;
    //     setUnsaved(hasChanges);
    // }, [name, type, ingredientName, amount, unit, ingredients]);



    const getRMData = async () => {
        const TYPE = 'raw_material'
        const items: any = await Item.getAllByType(db, TYPE)
        const formatted = items.map((item, index) => ({
            _id: String(index),
            id: item.id,
            name: item.name,
        }));
        console.log("Formatted: ", formatted)
        setRawMaterialNames(formatted);
    };


    useFocusEffect(
        useCallback(() => {
            getRMData()
            console.log(rawMaterialNames)
            console.log(rawMaterialNames.map(name => name.value))
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
        console.log('ingredients.length: ', ingredients.length)
        console.log('name: ', name)
        console.log('type: ', type)
        console.log('yieldAmount: ', yieldAmount)
        console.log('yieldUnit: ', yieldUnit)
                     
        const con = parseFloat(nuteConcentration)
        if (ingredients.length === 0 || name === '' || type === '' || yieldAmount === '' || yieldUnit === '') {
            Alert.alert('Make sure you fill out all fields')
        } else {
            try {
                const created_at = new Date().getTime()
                const recipeId = await Recipe.create(
                    db, 
                    name, 
                    type, 
                    ingredients, 
                    parseInt(yieldAmount), 
                    yieldUnit.toLowerCase(), 
                    parseFloat(nuteConcentration), 
                    created_at
                ) 
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
        <>
            <Form.Control name="name" label="Recipe Name" labelStyle={FORM.LABEL}>
                <Form.Input 
                    style={styles.input} 
                    value={name}
                    onChangeText={setName}
                />
            </Form.Control>
            <Form.Control name="recipeType" label="Recipe Type" labelStyle={FORM.LABEL}>
                <Form.Input 
                    style={styles.input} 
                    value={type}
                    onChangeText={setType}

                />
            </Form.Control>
            <Form.Control labelStyle={FORM.LABEL} label="Recipe Yield" name="recipeYield" >
                <Form.Input
                    value={yieldAmount}
                    onChangeText={setYieldAmount} 
                    style={{ width: '50%', backgroundColor: 'transparent', color: 'white' }}
                />
                <Form.Select
                    style={{ width: '50%', backgroundColor: 'transparent' }} 
                    options={[...INV_UNITS]}
                    placeholder="Select Unit"
                    onValueChange={(value: any) => {
                        setYieldUnit(value.value)
                        console.log(value.value)
                    }}
                />
            </Form.Control>
            <Form.Control name="nute_concentration" label="Nutrient Concentration" labelStyle={FORM.LABEL}>
                <Form.Input 
                    style={styles.input} 
                    value={nuteConcentration}
                    onChangeText={setNuteConcentration}

                />
            </Form.Control>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.9 }}
                colors={['#880', '#088', '#808']}
                style={{ flex: 1, padding: 16, borderRadius: 4}}
            >
                <Form.Control label="Select Ingredient" name="" labelStyle={FORM.LABEL}>
                    <Form.Select 
                        style={styles.input}
                        selectedValue={ingredientName}
                        options={rawMaterialNames}
                        placeholder="Select Ingredient"
                        onValueChange={(value: any) => {
                            setIngredientId(value.id)
                            setIngredientName(value.name)
                            console.log(value.value)
                        }}
                    />
                </Form.Control>
                <Form.Control labelStyle={FORM.LABEL} label="Ingredient Usage" name="ingredientUsage" >
                    <Form.Input
                        value={amount}
                        onChangeText={setAmount} 
                        style={{ width: '50%', backgroundColor: 'transparent', color: 'white' }}
                    />
                    <Form.Select
                        style={{ width: '50%', backgroundColor: 'transparent' }}
                        selectedValue={unit} 
                        options={[...INV_UNITS]}
                        placeholder="Select Unit"
                        onValueChange={(value: any) => {
                            setUnit(value.value)
                            console.log(value.value)
                        }}
                    />
                </Form.Control>
                <View style={{ margin: 36 }}>
                    <Button  color={'#f74a63cc'} title="Add Recipe Item" onPress={() => addIngredient(ingredientName, ingredientId, amount, unit)} />
                </View>

                <ScrollView style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff5', height: 'auto', padding: 16 }}>
                        <Text style={FORM.LABEL}>
                            Ingredients
                        </Text>

                        {ingredients.map((ingredient, index) => {
                            console.log(ingredient, index)
                            return(
                                <Text key={index} style={styles.subtitle}>
                                    {ingredient.ingredientName} — {ingredient.amount} {ingredient.unit}
                                </Text>
                            )
                            
                        })}    

                </ScrollView>


            </LinearGradient>
            <View style={{ marginTop: 16 }}>
                <Button  color={'#f74a63cc'} title="Submit" onPress={() => handleSubmit()} />
            </View>
        </>
    )
}


    
const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
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
    // fontSize: 16
    width: '100%'
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