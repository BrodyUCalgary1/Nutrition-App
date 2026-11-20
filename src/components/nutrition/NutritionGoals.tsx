import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NutritionGoal } from "../../types/nutrition";

// Define the component's properties
type Props = {
  onSave: (data: NutritionGoal) => void;
};

export default function NutritionGoals({ onSave }: Props) {
  // Store the user's inputs
  const [calorieGoal, setCalorieGoal] = useState("");
  const [proteinGoal, setProteinGoal] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();

  // Send the collected information to the parent component
  function handleSubmit() {
    if (calorieGoal.trim() === "" || proteinGoal.trim() === "") {
      setError("Please fill in all fields.");
      return;
    }
    if (
      !Number.isFinite(Number(calorieGoal)) ||
      !Number.isFinite(Number(proteinGoal))
    ) {
      setError("Please enter a number.");
      return;
    }
    if (Number(calorieGoal) <= 0 || Number(proteinGoal) <= 0) {
      setError("Goals must be greater than 0.");
      return;
    }

    setError("");

    onSave({
      calorieGoal: Number(calorieGoal),
      proteinGoal: Number(proteinGoal),
    });

    setCalorieGoal("");
    setProteinGoal("");
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.card,
      borderColor: theme.border,
      color: theme.text,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Calorie goal (kcal)
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. 2200"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            value={calorieGoal}
            onChangeText={setCalorieGoal}
          />
        </View>

        <View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Protein goal (g)
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. 140"
            placeholderTextColor={theme.textSecondary}
            keyboardType="decimal-pad"
            value={proteinGoal}
            onChangeText={setProteinGoal}
          />
        </View>

        {error !== "" && <Text style={{ color: theme.danger }}>{error}</Text>}
      </View>

      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Save goals</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 0,
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
