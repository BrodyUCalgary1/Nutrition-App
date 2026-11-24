import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import {
  isDailyFood,
  isNutritionGoal,
  isSavedFood,
  loadList,
  loadObject,
} from "../lib/storage";
import type {
  DailyFoods,
  NutritionEntry,
  NutritionGoal,
  SavedFood,
} from "../types/nutrition";

export function useNutritionData() {
  const [goals, setGoals] = useState<NutritionGoal | null>(null); //goals that are used in todays day.
  const [foods, setFoods] = useState<DailyFoods[]>([]); //foods that are used in todays day.
  const [savedFoods, setSavedFoods] = useState<SavedFood[]>([]); //food list for the foods that we want to save in the library
  const [isLoaded, setIsLoaded] = useState(false); //stops us from loading empty data sets if the code hasnt finsihed running yet

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
  }, []); //load async data

  useEffect(() => {
    async function loadData() {
      try {
        const loadedFoods = await loadList("foods", isDailyFood);
        const loadedGoals = await loadObject("goals", isNutritionGoal);
        const loadedSavedFoods = await loadList("savedFoods", isSavedFood);

        setFoods(loadedFoods);
        setGoals(loadedGoals);
        setSavedFoods(loadedSavedFoods);

        setIsLoaded(true);
      } catch (error) {
        // Deliberately NOT marked as loaded: saving now could overwrite
        // stored data that we simply failed to read
        console.log("Error loading data:", error);
      }
    }

    loadData();
  }, []); //load async data

  function addFood(food: NutritionEntry, date: string) {
    setFoods((currentFoods) => [
      ...currentFoods,
      {
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        id: Crypto.randomUUID(),
        date,
      },
    ]);
  } //addfood function that calls setfoods

  function deleteFood(id: string) {
    setFoods((currentFoods) => currentFoods.filter((food) => food.id !== id));
  } //delete the food @ the id given

  function editFood(id: string, updatedFood: NutritionEntry) {
    setFoods((currentFoods) =>
      currentFoods.map((food) =>
        food.id === id ? { ...food, ...updatedFood } : food,
      ),
    );
  } //edit food @ the id and return the new updatedFood

  function saveFoodToLibrary(food: Omit<SavedFood, "id">) {
    setSavedFoods((currentFoods) => {
      const alreadySaved = currentFoods.some((saved) => {
        // Manual foods are matched by name and nutrition values
        return (
          saved.name.trim().toLowerCase() === food.name.trim().toLowerCase() &&
          saved.calories === food.calories &&
          saved.protein === food.protein
        );
      });

      if (alreadySaved) {
        return currentFoods;
      }

      return [...currentFoods, { ...food, id: Crypto.randomUUID() }];
    });
  } //saves food the global library from barcode or from manual entry

  function deleteSavedFood(id: string) {
    setSavedFoods((currentFoods) =>
      currentFoods.filter((food) => food.id !== id),
    );
  } //deletes foods from the global library

  function saveGoals(newGoals: NutritionGoal) {
    setGoals(newGoals);
  }

  return {
    goals,
    saveGoals,
    foods,
    savedFoods,
    isLoaded,
    addFood,
    deleteFood,
    editFood,
    saveFoodToLibrary,
    deleteSavedFood,
  };
}
