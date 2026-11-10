import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import DailyFoodList from "./DailyFoodsList";
import DateNavigation from "./DateNavigation";
import FoodLibrary from "./FoodLibrary";
import NutritionGoals, { NutritionGoal } from "./NutritionGoals";
import NutritionInputs, {
  DailyFoods,
  NutritionEntry,
  SavedFood,
} from "./NutritionInputs";
import NutritionSummary from "./NutritionSummary";
import {
  calculateCaloriePercentage,
  calculateProteinPercentage,
  calculateRemainingCalories,
  calculateRemainingProtein,
} from "./NutritionUtils";

function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HomeScreen() {
  // Store the information received from NutritionInputs
  const [goals, setGoals] = useState<NutritionGoal | null>(null); //goals that are used in todays day.
  const [foods, setFoods] = useState<DailyFoods[]>([]); //foods that are used in todays day.
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>([]); //food list for the foods that we want to save in the library
  const [isLoaded, setIsLoaded] = useState(false); //stops us from loading empty data sets if the code hasnt finsihed running yet
  const [editingIndex, setEditingIndex] = useState<number | null>(null); //index for the food we want to edit
  const [searchQuery, setSearchQuery] = useState(""); //saving whats in the search bar for saved foods
  const [selectedDate, setSelectedDate] = useState(""); //select which day it is and see what you entered
  const [isSearchFocused, setIsSearchFocused] = useState(false); //search focus for the search bar

  useEffect(() => {
    async function loadData() {
      //async function to load data like food and goals
      try {
        const storedFoods = await AsyncStorage.getItem("foods");
        const storedGoals = await AsyncStorage.getItem("goals");
        const storedSavedFoods = await AsyncStorage.getItem("savedFoods");
        if (storedSavedFoods !== null) {
          setSavedFoods(JSON.parse(storedSavedFoods));
        }

        if (storedFoods !== null) {
          setFoods(JSON.parse(storedFoods));
        }

        if (storedGoals !== null) {
          setGoals(JSON.parse(storedGoals));
        }
      } catch (error) {
        console.log("Error loading data:", error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return; //another async function however, this runs everytime foods, goals or loaded changes

    async function saveData() {
      try {
        await AsyncStorage.setItem("foods", JSON.stringify(foods));
        await AsyncStorage.setItem("goals", JSON.stringify(goals));
        await AsyncStorage.setItem("savedFoods", JSON.stringify(savedFoods));
      } catch (error) {
        console.log("Error saving data:", error);
      }
    }

    saveData();
  }, [foods, goals, isLoaded, savedFoods]);

  useEffect(() => {
    setSelectedDate(getLocalDateString());
  }, []);

  function deleteFood(indexToDelete: number) {
    setFoods((currentFoods) =>
      currentFoods.filter((food, index) => index !== indexToDelete),
    );
  }
  function editFood(indexToEdit: number, updatedFood: NutritionEntry) {
    const newFoods = foods.map((food, index) => {
      if (index === indexToEdit) {
        return {
          ...food,
          ...updatedFood,
        };
      }

      return food;
    });
    setFoods(newFoods);
  }

  function deleteSavedFood(idToDelete: string) {
    setSavedFoods((currentSavedFoods) =>
      currentSavedFoods.filter((food) => food.id !== idToDelete),
    );
  }

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

  const filteredFoods = savedFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
    <ScrollView style={containerStyle} contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        <Text style={titleStyle}>My Nutrition App</Text>

        <NutritionInputs
          initialData={editingIndex !== null ? foods[editingIndex] : undefined}
          onCancel={() => setEditingIndex(null)}
          onSave={(data) => {
            if (editingIndex !== null) {
              editFood(editingIndex, data);
              setEditingIndex(null);
            } else {
              // Add food to today's food log
              setFoods((previousFoods) => [
                ...previousFoods,
                {
                  ...data,
                  id: Crypto.randomUUID(),
                  date: getLocalDateString(),
                },
              ]);

              // Add to library if it doesn't already exist
              setSavedFoods((currentSavedFoods) => {
                const alreadySaved = currentSavedFoods.some(
                  (food) =>
                    food.name.trim().toLowerCase() ===
                      data.name.trim().toLowerCase() &&
                    food.calories === data.calories &&
                    food.protein === data.protein,
                );

                if (alreadySaved) {
                  return currentSavedFoods;
                }

                return [
                  ...currentSavedFoods,
                  {
                    ...data,
                    id: Crypto.randomUUID(),
                  },
                ];
              });
            }
          }}
        />

        <FoodLibrary
          filteredFoods={filteredFoods}
          searchQuery={searchQuery}
          isSearchFocused={isSearchFocused}
          isDarkMode={isDarkMode}
          onSearchChange={setSearchQuery}
          onSearchFocus={() => setIsSearchFocused(true)}
          onSearchBlur={() => setIsSearchFocused(false)}
          onAddFood={(food) => {
            setFoods((previousFoods) => [
              ...previousFoods,
              {
                ...food,
                id: Crypto.randomUUID(),
                date: getLocalDateString(),
              },
            ]);
          }}
          onDeleteFood={deleteSavedFood}
        />

        <NutritionGoals onSave={(data) => setGoals(data)} />

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
          onDelete={(id) => {
            setFoods((currentFoods) =>
              currentFoods.filter((food) => food.id !== id),
            );
          }}
          onEdit={(id) => {
            setEditingIndex(foods.findIndex((food) => food.id === id));
          }}
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

  // Nutrition cards
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

  // Search input
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
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

  // Food Library
  foodItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    gap: 5,
  },

  foodInfo: {
    flex: 1,
  },

  foodName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  // Daily food entries
  dailyFood: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#777777",
    gap: 5,
  },
});
