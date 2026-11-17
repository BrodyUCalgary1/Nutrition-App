import NutritionGoals from "@/components/nutrition/NutritionGoals";
import { useNutrition } from "@/context/NutritionContext";
import { ScrollView, Text, useColorScheme } from "react-native";

export default function GoalsScreen() {
  const { goals, saveGoals } = useNutrition();
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#ffffff" : "#222222";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#090909" : "#f5f5f5" }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 15,
          color: textColor,
        }}
      >
        Daily Goals
      </Text>

      <Text style={{ color: textColor, marginBottom: 10 }}>
        {goals
          ? `Current goals: ${goals.calorieGoal} kcal · ${goals.proteinGoal} g protein`
          : "No goals set yet."}
      </Text>

      <NutritionGoals onSave={saveGoals} />
    </ScrollView>
  );
}
