import DailyFoodList from "@/components/nutrition/DailyFoodsList";
import {
  calculateCaloriePercentage,
  calculateProteinPercentage,
  calculateRemainingCalories,
  calculateRemainingProtein,
  getLocalDateString,
} from "@/components/nutrition/NutritionUtils";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import DateNavigation from "../../components/nutrition/DateNavigation";
import NutritionInputs from "../../components/nutrition/NutritionInputs";
import NutritionSummary from "../../components/nutrition/NutritionSummary";
import { useNutrition } from "../../context/NutritionContext";

export default function HomeScreen() {
  // Store the information received from NutritionInputs
  const { goals, foods, isLoaded, deleteFood, editFood } = useNutrition();
  const [editingId, setEditingId] = useState<string | null>(null); //index for the food we want to edit
  const [selectedDate, setSelectedDate] = useState(""); //select which day it is and see what you entered
  const [isScannerOpen, setIsScannerOpen] = useState(false); //tracks if the scanner is open or not

  useEffect(() => {
    setSelectedDate(getLocalDateString());
  }, []);

  const today = getLocalDateString();

  const selectedDaysFoods = foods.filter((food) => food.date === selectedDate);

  const isToday = selectedDate === today;

  function changeDate(days: number) {
    const date = new Date(selectedDate + "T12:00:00");
    date.setDate(date.getDate() + days);

    setSelectedDate(getLocalDateString(date));
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

  const remainingProtein = goals
    ? calculateRemainingProtein(goals.proteinGoal, totalProteins)
    : null;

  const caloriePercentage = goals
    ? calculateCaloriePercentage(goals.calorieGoal, totalCalories)
    : 0;

  const proteinPercentage = goals
    ? calculateProteinPercentage(goals.proteinGoal, totalProteins)
    : 0;

  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);

  const containerStyle = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  const textStyle = isDarkMode ? styles.darkText : styles.lightText;

  const titleStyle = isDarkMode ? styles.darkTitle : styles.lightTitle;

  return (
    <ScrollView
      style={containerStyle}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
    >
      <View>
        <Text style={titleStyle}>My Nutrition App</Text>

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

        {/*Display Todays Date and Navigate*/}
        <DateNavigation
          selectedDate={selectedDate}
          changeDate={changeDate}
          isToday={isToday}
          textStyle={textStyle}
        />

        {/* Display today's foods */}
        <DailyFoodList
          foods={selectedDaysFoods}
          textStyle={textStyle}
          isDarkMode={isDarkMode}
          onDelete={deleteFood}
          onEdit={setEditingId}
        />
        {/* Display daily goals */}
        <NutritionSummary
          textStyle={textStyle}
          isDarkMode={isDarkMode}
          totalCalories={totalCalories}
          totalProtein={totalProteins}
          remainingCalories={remainingCalories}
          remainingProtein={remainingProtein}
          caloriePercentage={caloriePercentage}
          proteinPercentage={proteinPercentage}
          goals={goals}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Main backgrounds
  darkScroll: {},

  lightScroll: {
    backgroundColor: "#f5f5f5",
  },

  scrollContent: {
    flexGrow: 1,
  },

  darkContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#090909",
  },

  lightContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    gap: 8,
  },

  // Text
  darkText: {
    color: "#ffffff",
  },

  lightText: {
    color: "#222222",
  },

  darkTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#ffffff",
  },

  lightTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#222222",
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },
  darkCard: {
    backgroundColor: "#242424",
    borderColor: "#444444",
  },

  lightCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dddddd",
  },

  darkInput: {
    backgroundColor: "#242424",
    color: "#ffffff",
    borderColor: "#555555",
  },

  lightInput: {
    backgroundColor: "#ffffff",
    color: "#222222",
    borderColor: "#cccccc",
  },

  // Daily food entries
  dailyFood: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#777777",
    gap: 5,
  },
});
