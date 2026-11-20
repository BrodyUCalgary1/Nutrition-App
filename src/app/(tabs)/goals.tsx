import NutritionGoals from "@/components/nutrition/NutritionGoals";
import { useNutrition } from "@/context/NutritionContext";
import { useTheme } from "@/hooks/use-theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function GoalsScreen() {
  const { goals, saveGoals } = useNutrition();
  const theme = useTheme();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Daily goals</Text>

      <View style={[styles.current, { backgroundColor: theme.primarySoft }]}>
        <Text style={[styles.currentLabel, { color: theme.primaryText }]}>
          CURRENT GOALS
        </Text>
        <Text style={[styles.currentValue, { color: theme.text }]}>
          {goals
            ? `${goals.calorieGoal} kcal · ${goals.proteinGoal} g protein`
            : "No goals set yet"}
        </Text>
      </View>

      <NutritionGoals onSave={saveGoals} />

      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Your goals apply to every day you view.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  current: {
    borderRadius: 20,
    padding: 16,
    gap: 4,
  },
  currentLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  currentValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  note: {
    fontSize: 14,
    lineHeight: 21,
    marginHorizontal: 4,
  },
});
