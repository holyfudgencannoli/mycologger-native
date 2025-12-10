import { Surface, TextInput } from "react-native-paper";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { PaperSelect } from "react-native-paper-select";
import * as Batches from '@db/recipe-batches'
import * as Culture from '@db/cultures'
import * as Agar from '@db/agar-cultures'
import * as Usage from '@db/usage_logs'
import * as Task from '@db/tasks'
import { convertToBase } from "@utils/unitConversion";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp } from "@react-navigation/native";
import { NavigationProps, RootDrawerParamsList } from "@navigation";
import { RecipeBatch } from "@features/recipe-batches/types";
import * as Form from '@custom/react-native-forms/src'
import { INV_UNITS } from "@constants/units";

type formattedRecipe ={
    _id: string,
    id: number, 
    value: string
}

type TaskRouteProps = RouteProp<RootDrawerParamsList, any>

export default function ExecuteAgarBatch() {  
    const db =  useSQLiteContext()
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<TaskRouteProps>();
    const { startTime, endTime } = route.params
    const [volume, setVolume] = useState("")
    const [volumeUnit, setVolumeUnit] = useState("")
    const [notes, setNotes] = useState("")
    const [quantity, setQuantity] = useState("")
    const [recipeBatches, setRecipeBatches] = useState<{_id: string, id: number, value: string}[]>([])
    const [selectedRecipeBatchId, setSelectedRecipeBatchId] = useState(0)
    const [selectedRecipeBatchName, setSelectedRecipeBatchName] = useState('')
    const [loading, setLoading] = useState(true)
    const { theme } = useTheme()

    const getRecipeBatchData = async () => {
        const items: RecipeBatch[] = await Batches.readAll(db)
        const formatted = items.map((item, index) => ({
            _id: String(index),
            id: item.id,
            value: item.name,
        }));
        console.log("Formatted: ", formatted)
        setRecipeBatches(formatted);
    };

    const units = ["Pound", "Ounce", "Kilogram", "Gram", "Milligram", "Gallon", "Quart", "Pint", "Fluid Ounce", 'Liter', 'Milliliter']

    const formattedUnits = units.map((unit, index) => ({
        _id: String(index),
        value: unit
    }));
    const handleExecute = async () => {
        const qty = parseInt(quantity);
        // const name = 
        if (isNaN(qty) || qty <= 0) {
            Alert.alert('Invalid Quantity', 'Please enter a valid positive number.');
            return;
        }

        setLoading(true); // Optional: add loading state


        try {
            for (let i=0; i<qty; i++) {

                const cultureId = await Culture.create(db, 'agar_cultures', new Date().getTime());
                console.log('Using recipebatch ID:', selectedRecipeBatchId);

                await Agar.create(
                    db,
                    cultureId,
                    selectedRecipeBatchId,
                    parseInt(volume),
                    volumeUnit,
                    new Date().getTime(),
                    null, null, null, null, null, null
                );

            }                
            const use = convertToBase({value: quantity ? parseInt(quantity) * parseFloat(volume) : parseFloat(volume), from: volumeUnit.toLowerCase()})
            console.log(use)
            
            const taskId = await Task.create(db, selectedRecipeBatchName, startTime, endTime, notes)
            console.log(taskId)
            
            await Usage.create(db, 'recipe_batch', selectedRecipeBatchId, taskId, use, volumeUnit, notes, new Date().getTime() )

            navigation.navigate('Dashboard');
        } catch (error) {
            console.error('Failed to create cultures:', error);
            Alert.alert('Error', 'Failed to create one or more cultures. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            getRecipeBatchData()
            console.log(recipeBatches)
            return () => {
                // setSelectedRecipeId(null);
                setVolume('');
                setVolumeUnit('');
            };
        }, [])
    );

    
    return(
        <ScreenPrimative edges={[]}>
            <View style={styles.container}>
                <ScrollView>
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.3, y: 0.9 }}
                        colors={['#94F8', '#00f', '#057']}
                        style={{ flex: 1, padding: 16}}
                    >
                        <Surface style={{ backgroundColor: '#0008', margin: 16, padding: 16 }}>
                            <Text style={styles.title}>Execute New Agar Batch</Text>
                        </Surface>
                        <Form.Control labelStyle={styles.label} label="Select Batch to Use" name="batch">
                            <Form.Select 
                                options={recipeBatches}
                                style={{ width: '100%' }}
                                onValueChange={(value: formattedRecipe) => {
                                    setSelectedRecipeBatchId(value.id)
                                    setSelectedRecipeBatchName(value.value)
                                }}
                            />
                        </Form.Control>
                        <Form.Control labelStyle={styles.label} label="Volume Per Container" name="volumePer" >
                            <Form.Input
                                value={volume}
                                onChangeText={setVolume} 
                                style={{ width: '50%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                            />
                            <Form.Select
                                style={{ width: '50%', backgroundColor: 'transparent' }} 
                                options={[...INV_UNITS]}
                                onValueChange={(value: any) => {
                                    setVolumeUnit(value.value)
                                    console.log(value.value)
                                }}
                            />
                        </Form.Control>
                        <Form.Control labelStyle={styles.label} label="Number of Containers" name="quantity" >
                            <Form.Input
                                value={quantity}
                                onChangeText={setQuantity} 
                                style={{ width: '100%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                            />
                        </Form.Control>
                    </LinearGradient>
                </ScrollView>
            </View>
        </ScreenPrimative>
    )
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  text: { fontSize: 20, marginBottom: 20 },
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
  },
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  label: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  
  title: {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
});