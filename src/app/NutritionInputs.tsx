
import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

// Define what data this component will send to other files
type NutritionData = {
  name: string;
  calories: number;
  protein: number;
  calorieGoal: number;
  proteinGoal: number;
};

// Define the component's properties
type Props = {
  onSave: (data: NutritionData) => void;
};

export default function NutritionInputs({ onSave }: Props) {

  // Store the user's inputs
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');

  // Send the collected information to the parent component
  function handleSubmit() {
    onSave({
      name,
      calories: Number(calories),
      protein: Number(protein),
      calorieGoal: Number(calorieGoal),
      proteinGoal: Number(proteinGoal),
    });
  }

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Nutrition Information</Text>

      <TextInput
        style={styles.input}
        placeholder="Food name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Calories"
        keyboardType="numeric"
        value={calories}
        onChangeText={setCalories}
      />

      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      <Text style={styles.heading}>Daily Goals</Text>

      <TextInput
        style={styles.input}
        placeholder="Calorie goal"
        keyboardType="numeric"
        value={calorieGoal}
        onChangeText={setCalorieGoal}
      />

      <TextInput
        style={styles.input}
        placeholder="Protein goal (g)"
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
