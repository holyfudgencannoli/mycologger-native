import { Alert, StyleSheet, Text, View } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import { useCallback, useEffect, useState, useMemo, useContext } from "react";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useSQLiteContext } from "expo-sqlite";

import * as RecipeBatch from "@db/recipe-batches";
import * as Recipe from "@db/recipes";
import * as Usage from "@db/usage_logs";
import * as Item from "@db/items";
import * as Task from "@db/tasks";

import { ingredientProps, recipeProps } from "@db/recipes/types";
import { WEIGHT_UNITS, VOLUME_UNITS } from "@constants/units";
import { useRoute } from "@react-navigation/native";

import * as Form from "@custom/react-native-forms/src";
import { NavigationProps } from "@navigation/types";
import { ScreenPrimative } from "@components/screen-primative";
import { COLORS } from "@constants/colors";
import Button from "@components/button";
import { RecipeBatchFormStateContext } from "src/context/FormContext";
import { FORM } from "@constants/styles";


export type RootStackParamList = {
  CreateRecipeBatch: { id: number; startTime?: string; endTime?: string };
};

export default function RecipeBatchForm({ setUnsaved }: { setUnsaved: (value: boolean) => void }) {
  const db = useSQLiteContext();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const route = useRoute<RouteProp<RootStackParamList, "CreateRecipeBatch">>();
  const { id, startTime, endTime } = route.params;

  // ------------ State ------------
  const [recipes, setRecipes] = useState<recipeProps[]>([]);
  const [recipe, setRecipe] = useState<recipeProps | null>(null);

  const {
		recipeId, setRecipeId,
		name, setName,

		quantity, setQuantity,
		realWeightAmount, setRealWeightAmount,
		realWeightUnit, setRealWeightUnit,

		realVolume, setRealVolume,
		realVolumeUnit, setRealVolumeUnit,

		loss, setLoss,
		notes, setNotes} = useContext(RecipeBatchFormStateContext)

  // ------------ Fetch recipes on screen focus ------------
  const loadRecipes = async () => {
    const list: recipeProps[] = await Recipe.readAll(db);
    setRecipes(list);
  };

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
      return () => {
        // reset some fields when leaving screen if needed
        setQuantity("");
        setRealWeightAmount("");
        setRealVolume("");
      };
    }, [])
  );

  // ------------ Fetch selected recipe ------------
  useEffect(() => {
    if (!recipeId) return;

    (async () => {
      const r = await Recipe.getById(db, recipeId);
      setRecipe(r);
    })();
  }, [recipeId]);

  // ------------ Compute Loss (memoized) ------------
  const computedLoss = useMemo(() => {
    if (!recipe) return "0.0000";

    const qty = parseFloat(quantity) || 0;
    let rw: number;
    {recipe.yield_unit == typeof WEIGHT_UNITS ? 
      rw = parseFloat(realWeightAmount) || 0 :
      rw = parseFloat(realVolume) || 0;
    }

    const expected = qty * recipe.yield_amount; 
    const lossVal = Math.max(0, expected - rw);

    return lossVal.toFixed(4);
  }, [quantity, realWeightUnit, recipe]);

  // Update state only when value actually changed
  useEffect(() => {
    if (loss !== computedLoss) {
      setLoss(computedLoss);
    }
  }, [computedLoss]);

  // ------------ Compute Batch Name ------------
  useEffect(() => {
    if (!recipe) return;


    const newName = recipe.nute_concentration
      ? `${recipe.nute_concentration * 100}% ${recipe.name} Batch`
      : `${recipe.name} Batch`;

    if (name !== newName) setName(newName);
  }, [recipe, quantity]);


  // ------------ SUBMIT ------------
  const handleSubmit = async () => {
    try {
      // basic validation
      if (!recipeId || recipeId === 0) {
        Alert.alert('Select Recipe', 'Please select a recipe to execute.');
        return;
      }

      const qty = parseFloat(quantity as any);
      if (isNaN(qty) || qty <= 0) {
        Alert.alert('Invalid Quantity', 'Please enter a valid quantity greater than 0.');
        return;
      }

      await Task.ExecuteRecipe({
        db,
        recipe_id: recipeId,
        quantity: qty,
        real_volume: parseFloat(realVolume),
        real_volume_unit: realVolumeUnit,
        real_weight: parseFloat(realWeightAmount),
        real_weight_unit: realWeightUnit,
        loss: parseFloat(loss),
        name,
        batch_notes: notes,
        start_time: startTime,
        end_time: endTime,
        task_notes: notes,
        usage_notes: notes
      });

      Alert.alert('Success', 'Recipe executed and batch created.');
      if (setUnsaved) setUnsaved(false);
      navigation.navigate("Dashboard")
    } catch (err) {
      console.error('ExecuteRecipe handleSubmit error', err);
      Alert.alert('Error', 'Failed to execute recipe. See logs for details.');
    }

  };

  // -----------------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------------

  return (
    <ScreenPrimative edges={[]} scroll style={styles.surfaceMetaContainer}>
      <View style={styles.surfaceContainer}>
        <Text style={theme.formTitle}>New Batch From Recipe</Text>
      </View>
    
      <Form.Control
          name="recipeId">
        <Form.Select 
          style={{ width: '100%' }}
          selectedValue={recipeId}
          onValueChange={(value: recipeProps) => setRecipeId(value.id)}
          options={recipes}
          placeholder="Select Recipe To Execute"
          size="md"
          type="embed"
        />
      </Form.Control>
      {recipe ? 
        <>

        <Form.Control name='batchName' label="Batch Name" labelStyle={FORM.LABEL}>
            <Form.Input 
            value={name}
            style={{ width: '100%' }}
            />
        </Form.Control>
        <Form.Control name="recipeQuantity" label="Quantity of Recipe">
            <Form.Input
                value={quantity}
                onChangeText={setQuantity}
                style={{ width: '100%' }}
            />
        </Form.Control>


            <Text style={FORM.TITLE}>Real Yield</Text>

          {recipe.yield_unit == typeof WEIGHT_UNITS ? 
          <>

            {/* //  Weight  */}
            <Form.Control labelStyle={FORM.LABEL} label="Recipe Yield Weight" name="recipeRealWeight">
              <Form.Input
                value={realWeightAmount}
                onChangeText={setRealWeightAmount}
                style={{ width: "50%", backgroundColor: "transparent", color: "white" }}
              />

              <Form.Select
                style={{ width: "50%", backgroundColor: "transparent" }}
                options={[...WEIGHT_UNITS]}
                placeholder="Select Unit"
                onValueChange={(v: any) => setRealWeightUnit(v.value)}
              />
            </Form.Control>

            {/* //  Volume */}
            <Form.Control labelStyle={FORM.LABEL} label="Recipe Yield Volume" name="recipeYieldVolume">
              <Form.Input
                value={realVolume}
                onChangeText={setRealVolume}
                style={{ width: "50%", backgroundColor: "transparent", color: "white" }}
              />

              <Form.Select
                style={{ width: "50%", backgroundColor: "transparent" }}
                options={[...VOLUME_UNITS]}
                placeholder="Select Unit"
                onValueChange={(v: any) => setRealVolumeUnit(v.value)}
              />
            </Form.Control>
          </> :
          <>
            {/* Volume */}
            <Form.Control labelStyle={FORM.LABEL} label="Recipe Yield Volume" name="recipeYieldVolume">
              <Form.Input
                value={realVolume}
                onChangeText={setRealVolume}
                style={{ width: "50%", backgroundColor: "transparent", color: "white" }}
              />

              <Form.Select
                style={{ width: "50%", backgroundColor: "transparent" }}
                options={[...VOLUME_UNITS]}
                placeholder="Select Unit"
                onValueChange={(v: any) => setRealVolumeUnit(v.value)}
              />
            </Form.Control>
            {/* Weight */}
            <Form.Control labelStyle={FORM.LABEL} label="Recipe Yield Weight" name="recipeRealWeight">
              <Form.Input
                value={realWeightAmount}
                onChangeText={setRealWeightAmount}
                style={{ width: "50%", backgroundColor: "transparent", color: "white" }}
              />

              <Form.Select
                style={{ width: "50%", backgroundColor: "transparent" }}
                options={[...WEIGHT_UNITS]}
                placeholder="Select Unit"
                onValueChange={(v: any) => setRealWeightUnit(v.value)}
              />
            </Form.Control>
          </>
          }

        {/* Loss */}
				<Form.Control label="Loss" labelStyle={FORM.LABEL} name="loss">
					<Form.Input
            value={loss}
            style={{ width: '100%' }}
            disabled
          />
        </Form.Control>

        {/* Notes */}
				<Form.Control label="Batch Notes" labelStyle={FORM.LABEL} name="notes">
          <Form.Input
						multiline
            value={notes}
            onChangeText={setNotes}
            style={{ width: '100%' }}
          />
        </Form.Control>
        <Button viewStyle={{ margin: 36 }} title="Submit" color={COLORS.button.primary} onPress={() => { void handleSubmit(); }} />
      </>:
      <></>
      }
      </ScreenPrimative>
    

  );
}


// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "red",
    textShadowColor: "blue",
    textShadowRadius: 16
  },
  surface: {
    padding: 16,
  },
  surfaceContainer: {
    padding: 16,
  },
  surfaceMetaContainer: {
    width: 350,
    margin: "auto",
    marginTop: 16,
    paddingBottom: 32
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "red",
    textShadowColor: "blue",
    textShadowRadius: 16
  }
});
