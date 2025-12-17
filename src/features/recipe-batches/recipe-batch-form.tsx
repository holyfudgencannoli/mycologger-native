import { StyleSheet, Text, View } from "react-native";
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

    const qty = parseFloat(quantity) || 1;
    const batchAmount = qty * recipe.yield_amount;

    const newName = recipe.nute_concentration
      ? `${recipe.nute_concentration * 100}% ${recipe.name} Batch ${batchAmount} ${recipe.yield_unit}`
      : `${recipe.name} Batch ${batchAmount} ${recipe.yield_unit}`;

    if (name !== newName) setName(newName);
  }, [recipe, quantity]);


  // ------------ SUBMIT ------------
  const handleSubmit = async () => {
    await Task.ExecuteRecipe({ db }, {
      db,
      recipe_id: recipeId,
      quantity: parseFloat(quantity),
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

    navigation.navigate("Dashboard");
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
      <Form.Control name='batchName' label="Batch Name" labelStyle={FORM.LABEL}>
        <Form.Input 
          value={name}
          style={{ width: '100%' }}
        />
      </Form.Control>
      {recipe ? 
      <>
      <Form.Control name="recipeQuantity">
        <Form.Input />
      </Form.Control>
        <View style={styles.surface}>
          <TextInput
            label="Quantity of Recipe"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
          />
        </View>

        {/* Real Weight + Volume */}
        <View style={styles.surfaceContainer}>
          <View style={styles.surface}>
            <Text style={styles.subtitle}>Real Yield</Text>
          </View>

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
                onValueChange={(v: any) => setRealWeightUnit(v.value)}
              />
            </Form.Control>
          </>
          }
        </View>

        {/* Loss */}
        <View style={styles.surface}>
          <TextInput
            label="Loss"
            value={loss}
            mode="outlined"
            disabled
          />
        </View>

        {/* Notes */}
        <View style={styles.surface}>
          <TextInput
            label="Batch Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
          />
        </View>
        <Button viewStyle={{ margin: 36 }} title="Submit" color={COLORS.button.primary} onPress={handleSubmit} />
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
