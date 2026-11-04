import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import NutritionInputs from './NutritionInputs';
import {
  calculateCaloriePercentage,
  calculateProteinPercentage,
  calculateRemainingCalories,
  calculateRemainingProtein,
} from './NutritionUtils';

// Define the structure of our nutrition data
type NutritionData = {
  name: string;
  calories: number;
  protein: number;
  calorieGoal: number;
  proteinGoal: number;
};

export default function HomeScreen() {

  // Store the information received from NutritionInputs
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);

  const remainingCalories = nutrition
  ? calculateRemainingCalories(
      nutrition.calorieGoal,
      nutrition.calories
    )
  : null;

const remainingProtein = nutrition
  ? calculateRemainingProtein(
      nutrition.proteinGoal,
      nutrition.protein
    )
  : null;

const caloriePercentage = nutrition
  ? calculateCaloriePercentage(
      nutrition.calorieGoal,
      nutrition.calories
    )
  : 0;

const proteinPercentage = nutrition
  ? calculateProteinPercentage(
      nutrition.proteinGoal,
      nutrition.protein
    )
  : 0;

  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.title}>My Nutrition App</Text>

        {/* Our separate input component */}
        <NutritionInputs
          onSave={(data) => setNutrition(data)}
        />

        {/* Display the information received */}
        {nutrition !== null && (
          <View style={styles.results}>
            <Text style={styles.heading}>Saved Information</Text>

            <Text>Food: {nutrition.name}</Text>
            <Text>Calories: {nutrition.calories}</Text>
            <Text>Protein: {nutrition.protein}g</Text>

            <Text style={styles.heading}>Daily Goals</Text>

            <Text>Calorie Goal: {nutrition.calorieGoal}</Text>
            <Text>Protein Goal: {nutrition.proteinGoal}g</Text>
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
