import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native";

type NutritionSummaryProps = {
  textStyle: StyleProp<TextStyle>;
  isDarkMode: boolean;
  totalCalories: number;
  totalProtein: number;
  remainingCalories: number | null;
  remainingProtein: number | null;
  caloriePercentage: number;
  proteinPercentage: number;
  goals: {
    calorieGoal: number;
    proteinGoal: number;
  } | null;
};

export default function NutritionSummary({
  textStyle,
  isDarkMode,
  totalCalories,
  totalProtein,
  remainingCalories,
  remainingProtein,
  caloriePercentage,
  proteinPercentage,
  goals,
}: NutritionSummaryProps) {
  if (!goals) return null;

  return (
    <View
      style={[styles.results, isDarkMode ? styles.darkCard : styles.lightCard]}
    >
      <Text style={[styles.heading, textStyle]}>Daily Goals</Text>

      <Text style={textStyle}>Calorie Goal: {goals.calorieGoal}</Text>

      <Text style={textStyle}>Protein Goal: {goals.proteinGoal}g</Text>

      {remainingCalories !== null && remainingCalories > 0 ? (
        <Text style={textStyle}>Remaining Calories: {remainingCalories}</Text>
      ) : remainingCalories !== null && remainingCalories <= 0 ? (
        <Text style={textStyle}>
          Over goal by: {Math.abs(remainingCalories)} calories
        </Text>
      ) : (
        <Text style={textStyle}>Calorie goal reached!</Text>
      )}

      {remainingProtein !== null && remainingProtein > 0 ? (
        <Text style={textStyle}>Remaining Protein: {remainingProtein}</Text>
      ) : remainingProtein !== null && remainingProtein <= 0 ? (
        <Text style={textStyle}>
          Over goal by: {Math.abs(remainingProtein)}g protein
        </Text>
      ) : (
        <Text style={textStyle}>Protein goal reached!</Text>
      )}

      <Text style={textStyle}>
        Calorie Goal Completed: {caloriePercentage.toFixed(1)}%
      </Text>

      <Text style={textStyle}>
        Protein Goal Completed: {proteinPercentage.toFixed(1)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  results: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  darkCard: {
    backgroundColor: "#242424",
    borderColor: "#444444",
  },
  lightCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dddddd",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
});
