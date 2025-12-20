import { Surface, TextInput } from "react-native-paper";
import { ImageBG } from "@components/image-bg";
import { ScreenPrimative } from "@components/screen-primative";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect, useNavigation, useRoute, useRoutePath } from "@react-navigation/native";
import { useCallback, useContext, useState } from "react";
import { PaperSelect } from "react-native-paper-select";
import * as Batches from '@db/recipe-batches'
import * as Culture from '@db/cultures'
import * as Usage from '@db/usage_logs'
import * as Task from '@db/tasks'
import * as Form from '@custom/react-native-forms/src'
import { convertToBase } from "@utils/unitConversion";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp } from "@react-navigation/native";
import { NavigationProps, RootDrawerParamsList } from "@navigation/types";
import { RecipeBatch } from "@db/recipe-batches/types";
import { INV_UNITS } from "@constants/units";
import Button from "@components/button";
import { COLORS } from "@constants/colors";
import { FormStateContext } from "src/context/FormContext";
import { CaseHelper } from "@utils/case-helper";
import { CONTAINER, FORM } from "@constants/styles";

type formattedRecipe ={
    _id: string,
    id: number, 
    name: string
}

type TaskRouteProps = RouteProp<RootDrawerParamsList, any>

export default function ExecuteBatch({}) {  
    const db =  useSQLiteContext()
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<TaskRouteProps>();
    const { startTime, endTime, type } = route.params
    const [volume, setVolume] = useState("")
    const [volumeUnit, setVolumeUnit] = useState("")
    const [notes, setNotes] = useState("")
    const [quantity, setQuantity] = useState("")
    const [usageAmount, setUsageAmount] = useState("")
    const [usageUnit, setUsageUnit] = useState("")
    const [recipeBatches, setRecipeBatches] = useState<formattedRecipe[]>([])
    const { selectedRecipeBatchId, setSelectedRecipeBatchId } =useContext(FormStateContext)
    const { selectedRecipeBatchName, setSelectedRecipeBatchName } =useContext(FormStateContext)
    const [loading, setLoading] = useState(true)
    const path = useRoutePath();
    

    const getRecipeBatchData = async () => {
        const items: RecipeBatch[] = await Batches.readAll(db)
        const formatted = items.map((item, index) => ({
            _id: String(index),
            id: item.id,
            name: item.name,
        }));
        console.log("Formatted: ", formatted)
        setRecipeBatches(formatted);
    };

    const handleExecute = async() => {
        try {
            setLoading(true)
            // validate minimal inputs
            const qty = parseInt(quantity as any)
            if (isNaN(qty) || qty <= 0) {
                Alert.alert('Invalid input', 'Please enter a valid quantity greater than 0.')
                return
            }

            if (!selectedRecipeBatchId || selectedRecipeBatchId === 0) {
                Alert.alert('Select Batch', 'Please select a recipe batch to use.')
                return
            }

            if (!volume || volume.trim() === '') {
                Alert.alert('Missing volume', 'Please enter a volume per container.')
                return
            }

            if (!volumeUnit || volumeUnit.trim() === '') {
                Alert.alert('Missing volume unit', 'Please enter a volume unit per container.')
                return
            }
            const use_amt = parseInt(usageAmount as any)
            if (isNaN(use_amt) || use_amt <= 0) {
                Alert.alert('Missing usage amount', 'Please enter a valid usage amount.')
                return
            }
            if (!usageUnit || usageUnit.trim() === '') {
                Alert.alert('Missing usage unit', 'Please enter a usage unit.')
                return
            }
            if (!volume || volume.trim() === '') {
                Alert.alert('Missing volume', 'Please enter a volume per container.')
                return
            }
            if (!startTime || new Date(startTime) === undefined) {
                Alert.alert('Missing start time', 'Please enter a valid start time.')
                return
            }
            if (!endTime || new Date(endTime) === undefined) {
                Alert.alert('Missing end time', 'Please enter a valid end time.')
                return
            }


            console.log(usageUnit)
            console.log(usageAmount)

            // execute and notify
            await Task.ExecuteAgar({
                db,
                quantity,
                type,
                recipe_batch_id: selectedRecipeBatchId,
                volume_amount: volume,
                volume_unit: volumeUnit,
                usage_amount: usageAmount,
                usage_unit: usageUnit,
                start_time: new Date(startTime).getTime(),
                end_time: new Date(endTime).getTime(),
                notes
            })

            Alert.alert('Success', 'Batch executed successfully.')
            navigation.navigate("Dashboard")
            console.log("Executed Agar Batch!")
        } catch (err) {
            console.error('handleExecute error', err)
            Alert.alert('Error', 'Failed to execute batch. See logs for details.')
        } finally {
            setLoading(false)
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            getRecipeBatchData()
            console.log(recipeBatches)
            console.log(type)
            return () => {
                // setSelectedRecipeId(null);
                setVolume('');
                setVolumeUnit('');
            };
        }, [])
    );

    
    return(
        <View style={CONTAINER.FULL}>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0.3, y: 0.9 }}
                colors={COLORS.BACKGROUND_GRADIENT.PRIMARY}
                style={{ flex: 1, padding: 16}}
            >
                <ScreenPrimative scroll  edges={[]}>
                    <Surface style={{ backgroundColor: '#0008', margin: 16, padding: 16 }}>
                        <Text style={FORM.TITLE}>Execute New {CaseHelper.toCleanCase(type)} Batch</Text>
                    </Surface>
                    <Form.Control labelStyle={FORM.LABEL} label="Start Time" name="startTime" >

                        <Form.Input
                            value={new Date(startTime).toLocaleString()}
                            disabled
                            style={{ width: '100%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                        />
                    </Form.Control>
                    
                    <Form.Control labelStyle={FORM.LABEL} label="End Time" name="endTime" >
                        <Form.Input
                            value={new Date(endTime).toLocaleString()}
                            disabled
                            style={{ width: '100%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                        />
                    </Form.Control>
                    <Form.Control labelStyle={FORM.LABEL} label="Select Batch to Use" name="batch">
                        <Form.Select 
                            placeholder="Select Recipe Batch"
                            options={recipeBatches}
                            style={{ width: '100%' }}
                            onValueChange={(value: formattedRecipe) => {
                                setSelectedRecipeBatchId(value.id)
                                setSelectedRecipeBatchName(value.name)
                            }}
                        />
                    </Form.Control>
                    <Form.Control labelStyle={FORM.LABEL} label="Volume Per Container" name="volumePer" >
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
                    <Form.Control labelStyle={FORM.LABEL} label="Number of Containers" name="quantity" >
                        <Form.Input
                            value={quantity}
                            onChangeText={setQuantity} 
                            style={{ width: '100%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                        />
                    </Form.Control>
                    
                    <Form.Control labelStyle={FORM.LABEL} label="Total Usage" name="usage" >
                        <Form.Input
                            value={usageAmount}
                            onChangeText={setUsageAmount} 
                            style={{ width: '50%', textAlign: 'center', backgroundColor: 'transparent', color: 'white' }}
                        />
                        
                        <Form.Select
                            style={{ width: '50%', backgroundColor: 'transparent' }} 
                            options={[...INV_UNITS]}
                            placeholder="Select Unit"       
                            onValueChange={(value: any) => {
                                setUsageUnit(value.value)
                                console.log(value.value)
                            }}
                        />
                    </Form.Control>
                    <Button title="Submit" viewStyle={{ margin: 72, }} color={COLORS.button.primary} onPress={() => { void handleExecute(); }}/>
                </ScreenPrimative>
            </LinearGradient>
        </View>
    )
}