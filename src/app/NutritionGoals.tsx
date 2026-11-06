
import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

// Define what data this component will send to other files
export type NutritionGoal = {
  calorieGoal: number;
  proteinGoal: number;
};


// Define the component's properties
type Props = {
  onSave: (data: NutritionGoal) => void;
};

export default function NutritionGoals({ onSave }: Props) {

  // Store the user's inputs
    const[calorieGoal, setCaloriesGoal] =useState('')
    const[proteinGoal, setProteinGoal] =useState('')

  // Send the collected information to the parent component
  function handleSubmit() {
    onSave({
        calorieGoal: Number(calorieGoal),
        proteinGoal: Number(proteinGoal)
    });

    setCaloriesGoal('');
    setProteinGoal('');
  }

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Nutrition Goals</Text>

      <TextInput
        style={styles.input}
        placeholder="Calorie Goal"
        keyboardType="numeric"
        value={calorieGoal}
        onChangeText={setCaloriesGoal}
      />


      <TextInput
        style={styles.input}
        placeholder="Protein Goal (g)"
        keyboardType="numeric"
        value={proteinGoal}
        onChangeText={setProteinGoal}
      />



      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Information</Text>
      </Pressable>

    </View>
  );
}






const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
