
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

// Define what data this component will send to other files
export type NutritionEntry = {
  name: string;
  calories: number;
  protein: number;
};


// Define the component's properties
type Props = {
  onSave: (data: NutritionEntry) => void;
};

export default function NutritionInputs({ onSave }: Props) {

  // Store the user's inputs
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [error, setError] = useState('');

  // Send the collected information to the parent component
  function handleSubmit() {
    if (!name.trim() || calories.trim() === '' || protein.trim() === '') {
      setError('Please fill in all fields.');
      return;
    }
    if( !Number.isFinite(Number(calories))||!Number.isFinite(Number(protein))){
      setError('Please enter a number')
      return;
    }
    if( Number(calories) <= 0|| Number(protein) <= 0){
      setError('Please enter non-negative numbers and non-Zero')
      return;
    }
    


  setError('');

    onSave({
      name,
      calories: Number(calories),
      protein: Number(protein),
    });

    setName('');
    setCalories('');
    setProtein('');
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

      {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}


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
