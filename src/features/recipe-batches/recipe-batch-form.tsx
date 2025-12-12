import { Button, StyleSheet, Text } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import { useTheme } from "../../hooks/useTheme";
import { useCallback, useEffect, useState, useMemo } from "react";
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

  const [recipeId, setRecipeId] = useState(0);
  const [name, setName] = useState("");

  const [quantity, setQuantity] = useState("");
  const [realWeightAmount, setRealWeightAmount] = useState("");
  const [realWeightUnit, setRealWeightUnit] = useState("");

  const [realVolume, setRealVolume] = useState("");
  const [realVolumeUnit, setRealVolumeUnit] = useState("");

  const [loss, setLoss] = useState("");
  const [notes, setNotes] = useState("");

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
    <Surface style={styles.surfaceMetaContainer}>
      <Surface style={styles.surfaceContainer}>
        <Text style={theme.formTitle}>New Batch</Text>
        <Text style={theme.formTitle}>From Recipe</Text>
      </Surface>

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
      <Form.Control name='batchName' label="Batch Name" labelStyle={styles.label}>
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
        <Surface style={styles.surface}>
          <TextInput
            label="Quantity of Recipe"
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
          />
        </Surface>

        {/* Real Weight + Volume */}
        <Surface style={styles.surfaceContainer}>
          <Surface style={styles.surface}>
            <Text style={styles.subtitle}>Real Yield</Text>
          </Surface>

          {recipe.yield_unit == typeof WEIGHT_UNITS ? 
          <>

            {/* //  Weight  */}
            <Form.Control labelStyle={styles.label} label="Recipe Yield Weight" name="recipeRealWeight">
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
            <Form.Control labelStyle={styles.label} label="Recipe Yield Volume" name="recipeYieldVolume">
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
            <Form.Control labelStyle={styles.label} label="Recipe Yield Volume" name="recipeYieldVolume">
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
            <Form.Control labelStyle={styles.label} label="Recipe Yield Weight" name="recipeRealWeight">
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
        </Surface>

        {/* Loss */}
        <Surface style={styles.surface}>
          <TextInput
            label="Loss"
            value={loss}
            mode="outlined"
            disabled
            style={{ flex: 1 }}
          />
        </Surface>

        {/* Notes */}
        <Surface style={styles.surface}>
          <TextInput
            label="Batch Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={{ flex: 1 }}
          />
        </Surface>
        <Button title="Submit" color="#000" onPress={handleSubmit} />
      </>:
      <></>
      }
      </Surface>
    

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
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  surfaceContainer: {
    padding: 16,
    backgroundColor: "rgba(56,185,255,0.3)"
  },
  surfaceMetaContainer: {
    backgroundColor: "rgba(55,255,55,0.4)",
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
