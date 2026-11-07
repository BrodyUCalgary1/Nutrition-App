import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import NutritionGoals, { NutritionGoal } from './NutritionGoals';
import NutritionInputs, { NutritionEntry } from './NutritionInputs';
import {
  calculateCaloriePercentage,
  calculateProteinPercentage,
  calculateRemainingCalories,
  calculateRemainingProtein,
} from './NutritionUtils';


export default function HomeScreen() {

  // Store the information received from NutritionInputs
  const [goals, setGoals] = useState<NutritionGoal | null>(null);
  const [foods, setFoods] = useState<NutritionEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); //stops us from loading empty data sets if the code hasnt finsihed running yet
  const [editingIndex, setEditingIndex] = useState<number | null>(null);


  useEffect(() => {
  async function loadData() {//async function to load data like food and goals
    try {
      const storedFoods = await AsyncStorage.getItem('foods');
      const storedGoals = await AsyncStorage.getItem('goals');

      if (storedFoods !== null) {
        setFoods(JSON.parse(storedFoods));
      }

      if (storedGoals !== null) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoaded(true);
    }
  }

  loadData();
}, []);

  useEffect(() => {
  if (!isLoaded) return;//another async function however, this runs everytime foods, goals or loaded changes

  async function saveData() {
    try {
      await AsyncStorage.setItem('foods', JSON.stringify(foods));
      await AsyncStorage.setItem('goals', JSON.stringify(goals));
    } catch (error) {
      console.log('Error saving data:', error);
    }
  }

  saveData();
}, [foods, goals, isLoaded]);


function deleteFood(indexToDelete: number) {
  setFoods((currentFoods) =>
    currentFoods.filter((food, index) => index !== indexToDelete)
  );
}
function editFood(indexToEdit: number, updatedFood: NutritionEntry) {
   const newFoods = foods.map((food, index) => {
  if (index === indexToEdit) {
    return updatedFood

  }

  return food;
  });
  setFoods(newFoods)
}


  let totalCalories = foods.reduce((total, currentItem) => {
  return total + currentItem.calories;
  }, 0);

let totalProteins = foods.reduce((total, currentItem) => {
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

  return (
  <ScrollView>
    <View style={styles.container}>

      <Text style={styles.title}>My Nutrition App</Text>

      <NutritionInputs
         initialData={editingIndex !== null ? foods[editingIndex] : undefined}
          onCancel={() => setEditingIndex(null)}
          onSave={(data) => {
          if (editingIndex !== null) {
              editFood(editingIndex, data);
              setEditingIndex(null);
          } else {
              setFoods((previousFoods) => [...previousFoods, data]);
          }
          }}
        />
      <NutritionGoals
        onSave={(data) => setGoals(data)}
      />


      {/* Display saved foods */}
      {foods.length > 0 && (
        <View style={styles.results}>
          <Text style={styles.heading}>Saved Foods</Text>

          {foods.map((food, index) => (
            <View key={index}>
              <Text>Food: {food.name}</Text>
              <Text>Calories: {food.calories}</Text>
              <Text>Protein: {food.protein}g</Text>
              <Button
                title="Delete"
                onPress={() =>deleteFood(index)}
              />
              <Button
              title="Edit"
              onPress={() => setEditingIndex(index)}
                />

            </View>
          ))}

          <Text>Total Calories: {totalCalories}</Text>
          <Text>Total Protein: {totalProteins}g</Text>
        </View>
      )}

      {/* Display daily goals */}
      {goals !== null && (
        <View style={styles.results}>
          <Text style={styles.heading}>Daily Goals</Text>

          <Text>Calorie Goal: {goals.calorieGoal}</Text>
          <Text>Protein Goal: {goals.proteinGoal}g</Text>

          {remainingCalories !== null && remainingCalories > 0 ? (
            <Text>Remaining Calories: {remainingCalories}</Text>
          ) : remainingCalories !== null && remainingCalories <= 0 ? (
           <Text>Over goal by: {Math.abs(remainingCalories)} calories</Text>
          ) : (
           <Text>Calorie goal reached!</Text>
          )}


          {remainingProtein !== null && remainingProtein > 0 ? (
            <Text>Remaining Protein: {remainingProtein}</Text>
          ) : remainingProtein !== null && remainingProtein <= 0 ? (
           <Text>Over goal by: {Math.abs(remainingProtein)} calories</Text>
          ) : (
           <Text>Protein goal reached!</Text>
          )}

          <Text>Calorie Goal Completed: {caloriePercentage.toFixed(1)}%</Text>
          <Text>Protein Goal Completed: {proteinPercentage.toFixed(1)}%</Text>
        </View>
      )}

    </View>
  </ScrollView>
);  
}
  
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  results: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    gap: 8,
  },
});
