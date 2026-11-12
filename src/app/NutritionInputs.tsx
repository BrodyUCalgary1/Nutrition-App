import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

// Define what the food will send to other files
export type NutritionEntry = {
  name: string;
  calories: number;
  protein: number;
};
//saved foods that are stored in the library with an id
export type SavedFood = NutritionEntry & {
  id: string;

  // Optional information for barcode-scanned products
  barcode?: string;
  brand?: string;
  quantity?: string;
  servingGrams?: number;

  // Original nutrition values per 100g
  caloriesPer100g?: number | null;
  proteinPer100g?: number | null;
  carbsPer100g?: number | null;
  fatPer100g?: number | null;
};

export type DailyFoods = NutritionEntry & {
  id: string;
  date: string;
};

// Define the component's properties
type Props = {
  onSave: (data: NutritionEntry) => void;
  initialData?: NutritionEntry;
  onCancel?: () => void;
};

export default function NutritionInputs({
  onSave,
  initialData,
  onCancel,
}: Props) {
  // Store the user's inputs
  const [name, setName] = useState(initialData?.name ?? "");
  const [calories, setCalories] = useState(
    initialData?.calories.toString ?? "",
  );
  const [protein, setProtein] = useState(initialData?.protein.toString ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    //updates intial data when the editing button is clicked
    if (initialData) {
      setName(initialData.name);
      setCalories(initialData.calories.toString());
      setProtein(initialData.protein.toString());
    } else {
      setName("");
      setCalories("");
      setProtein("");
    }

    setError("");
  }, [initialData]);

  // Send the collected information to the parent component
  function handleSubmit() {
    if (!name.trim() || calories.trim() === "" || protein.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }
    if (
      !Number.isFinite(Number(calories)) ||
      !Number.isFinite(Number(protein))
    ) {
      setError("Please enter a number");
      return;
    }
    if (Number(calories) <= 0 || Number(protein) <= 0) {
      setError("Please enter non-negative numbers and non-Zero");
      return;
    }

    setError("");

    onSave({
      name,
      calories: Number(calories),
      protein: Number(protein),
    });

    setName("");
    setCalories("");
    setProtein("");
  }
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const headingStyle = isDarkMode ? styles.darkHeading : styles.lightHeading;
  const inputStyle = isDarkMode ? styles.darkInput : styles.lightInput;

  return (
    <View style={styles.container}>
      <Text style={headingStyle}>
        {initialData ? "Edit Food" : "Nutrition Information"}
      </Text>

      <TextInput
        style={inputStyle}
        placeholder="Food name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={inputStyle}
        placeholder="Calories"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <TextInput
        style={inputStyle}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      {error !== "" && <Text style={{ color: "red" }}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {initialData ? "Update Foods" : "Save Information"}
        </Text>
      </Pressable>

      {initialData && (
        <Pressable style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  lightHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  darkHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  lightInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  darkInput: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "white",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
