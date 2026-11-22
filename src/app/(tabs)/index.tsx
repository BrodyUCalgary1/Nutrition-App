import DailyFoodList from "@/components/nutrition/DailyFoodsList";
import DateNavigation from "@/components/nutrition/DateNavigation";
import NutritionInputs from "@/components/nutrition/NutritionInputs";
import NutritionSummary from "@/components/nutrition/NutritionSummary";
import {
  calculateCaloriePercentage,
  calculateProteinPercentage,
  calculateRemainingCalories,
  getLocalDateString,
} from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const { goals, foods, deleteFood, editFood } = useNutrition();
  const [editingId, setEditingId] = useState<string | null>(null); // the food being edited
  const [selectedDate, setSelectedDate] = useState(getLocalDateString()); // the day being viewed
  const theme = useTheme();

  const today = getLocalDateString();
  const selectedDaysFoods = foods.filter((food) => food.date === selectedDate);
  const datesWithFoods = new Set(foods.map((food) => food.date));

  // Jump forward or back by whole weeks, but never past today
  function shiftWeek(weeks: number) {
    const date = new Date(selectedDate + "T12:00:00");
    date.setDate(date.getDate() + weeks * 7);

    const next = getLocalDateString(date);
    setSelectedDate(next > today ? today : next);
  }

  const totalCalories = selectedDaysFoods.reduce((total, currentItem) => {
    return total + currentItem.calories;
  }, 0);

  const totalProteins = selectedDaysFoods.reduce((total, currentItem) => {
    return total + currentItem.protein;
  }, 0);

  const remainingCalories = goals
    ? calculateRemainingCalories(goals.calorieGoal, totalCalories)
    : null;

  const caloriePercentage = goals
    ? calculateCaloriePercentage(goals.calorieGoal, totalCalories)
    : 0;

  const proteinPercentage = goals
    ? calculateProteinPercentage(goals.proteinGoal, totalProteins)
    : 0;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}
    >
      <DateNavigation
        selectedDate={selectedDate}
        today={today}
        datesWithFoods={datesWithFoods}
        onSelectDate={setSelectedDate}
        onShiftWeek={shiftWeek}
      />

      {editingId !== null && (
        <NutritionInputs
          initialData={foods.find((food) => food.id === editingId)}
          onCancel={() => setEditingId(null)}
          onSave={(data) => {
            editFood(editingId, data);
            setEditingId(null);
          }}
        />
      )}

      <DailyFoodList
        foods={selectedDaysFoods}
        onDelete={deleteFood}
        onEdit={setEditingId}
      />

      <NutritionSummary
        totalCalories={totalCalories}
        totalProtein={totalProteins}
        remainingCalories={remainingCalories}
        caloriePercentage={caloriePercentage}
        proteinPercentage={proteinPercentage}
        goals={goals}
      />
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
});
