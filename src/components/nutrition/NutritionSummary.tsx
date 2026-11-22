import { useTheme } from "@/hooks/use-theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NutritionGoal } from "../../types/nutrition";
import CalorieRing from "./CalorieRing";
import { formatNumber } from "./NutritionUtils";

type NutritionSummaryProps = {
  totalCalories: number;
  totalProtein: number;
  remainingCalories: number | null;
  caloriePercentage: number;
  proteinPercentage: number;
  goals: NutritionGoal | null;
};

export default function NutritionSummary({
  totalCalories,
  totalProtein,
  remainingCalories,
  caloriePercentage,
  proteinPercentage,
  goals,
}: NutritionSummaryProps) {
  const theme = useTheme();

  const eaten = Math.round(totalCalories).toLocaleString();
  const protein = formatNumber(totalProtein, 1);

  // No goals yet: show what was eaten and point to the Goals tab
  if (!goals || remainingCalories === null) {
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
          EATEN
        </Text>
        <Text style={[styles.bigValue, { color: theme.text }]}>
          {eaten} kcal · {protein} g protein
        </Text>
        <Text style={[styles.note, { color: theme.textSecondary }]}>
          Set daily goals to see your progress.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/goals")}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.buttonText}>Set goals</Text>
        </Pressable>
      </View>
    );
  }

  const isOver = remainingCalories < 0;

  return (
    <View
      accessible
      accessibilityLabel={`${eaten} of ${goals.calorieGoal} calories eaten. ${protein} of ${goals.proteinGoal} grams of protein.`}
      style={[styles.card, { backgroundColor: theme.card }]}
    >
      <View style={styles.topRow}>
        <View style={styles.stats}>
          <View>
            <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
              EATEN
            </Text>
            <Text style={[styles.bigValue, { color: theme.text }]}>
              {eaten}
              <Text style={[styles.unit, { color: theme.textSecondary }]}>
                {" "}
                kcal
              </Text>
            </Text>
          </View>

          <View>
            <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
              GOAL
            </Text>
            <Text style={[styles.bigValue, { color: theme.text }]}>
              {goals.calorieGoal.toLocaleString()}
              <Text style={[styles.unit, { color: theme.textSecondary }]}>
                {" "}
                kcal
              </Text>
            </Text>
          </View>
        </View>

        <CalorieRing
          percentage={caloriePercentage}
          value={Math.round(Math.abs(remainingCalories)).toLocaleString()}
          label={isOver ? "KCAL OVER" : "KCAL LEFT"}
          isOver={isOver}
        />
      </View>

      <View>
        <View style={styles.proteinHeader}>
          <Text style={[styles.proteinLabel, { color: theme.text }]}>
            Protein
          </Text>
          <Text style={[styles.proteinValue, { color: theme.textSecondary }]}>
            {protein} / {goals.proteinGoal} g
          </Text>
        </View>

        <View style={[styles.track, { backgroundColor: theme.accentSoft }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${proteinPercentage}%`,
                backgroundColor: theme.accent,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stats: {
    gap: 16,
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
  bigValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
  },
  proteinHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  proteinLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  proteinValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  track: {
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 4,
  },
  note: {
    fontSize: 14,
    lineHeight: 21,
  },
  button: {
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
