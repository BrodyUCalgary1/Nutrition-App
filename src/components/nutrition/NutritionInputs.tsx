import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NutritionEntry } from "../../types/nutrition";

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
    initialData?.calories.toString() ?? "",
  );
  const [protein, setProtein] = useState(initialData?.protein.toString() ?? "");
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
    if (Number(calories) <= 0) {
      setError("Calories must be greater than 0.");
      return;
    }
    if (Number(protein) < 0) {
      setError("Protein can't be negative.");
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

  const theme = useTheme();

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
      {initialData && (
        <Text style={[styles.heading, { color: theme.text }]}>Edit food</Text>
      )}

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Food name
          </Text>
          <TextInput
            style={inputStyle}
            placeholder="e.g. Peanut butter toast"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Calories
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={calories}
              onChangeText={setCalories}
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Protein (g)
            </Text>
            <TextInput
              style={inputStyle}
              placeholder="0"
              placeholderTextColor={theme.textSecondary}
              keyboardType="decimal-pad"
              value={protein}
              onChangeText={setProtein}
            />
          </View>
        </View>

        {error !== "" && <Text style={{ color: theme.danger }}>{error}</Text>}
      </View>

      <Pressable
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          {initialData ? "Update food" : "Save & log"}
        </Text>
      </Pressable>

      {initialData && (
        <Pressable
          accessibilityRole="button"
          style={[
            styles.button,
            styles.outline,
            { borderColor: theme.primary },
          ]}
          onPress={onCancel}
        >
          <Text style={[styles.buttonText, { color: theme.primaryText }]}>
            Cancel
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  field: {
    flex: 1,
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
  outline: {
    borderWidth: 1.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
