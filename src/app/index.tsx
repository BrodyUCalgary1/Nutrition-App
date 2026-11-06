import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
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
        onSave={(data) => setFoods((previousFoods) => [...previousFoods, data])}
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

          <Text>Remaining Calories: {remainingCalories}</Text>
          <Text>Remaining Protein: {remainingProtein}g</Text>

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
