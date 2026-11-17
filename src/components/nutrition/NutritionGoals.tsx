
import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme
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
    const[error,setError]=useState('')

  // Send the collected information to the parent component
  function handleSubmit() {
    
    if( calorieGoal.trim() == ""|| proteinGoal.trim() == ""){
      setError('Please fill in all fields.')
      return;
    }
    if( !Number.isFinite(Number(calorieGoal))||!Number.isFinite(Number(proteinGoal))){
      setError('Please enter a number')
      return;
    }
    if( Number(calorieGoal) <= 0|| Number(proteinGoal) <= 0){
      setError('Please enter non-negative numbers and non-Zero')
      return;
    }



    setError('')

    onSave({
        calorieGoal: Number(calorieGoal),
        proteinGoal: Number(proteinGoal)
    });

    setCaloriesGoal('');
    setProteinGoal('');
  }
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark');
  } , [colorScheme]);

const headingStyle = isDarkMode
  ? styles.darkHeading
  : styles.lightHeading;
const inputStyle = isDarkMode
    ? styles.darkInput
    : styles.lightInput;


  return (
    <View style={styles.container}>

      <Text style={headingStyle}>Nutrition Goals</Text>

      <TextInput
        style={inputStyle}
        placeholder="Calorie Goal"
        keyboardType="numeric"
        value={calorieGoal}
        onChangeText={setCaloriesGoal}
      />


      <TextInput
        style={inputStyle}
        placeholder="Protein Goal (g)"
        keyboardType="numeric"
        value={proteinGoal}
        onChangeText={setProteinGoal}
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
  lightHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  darkHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: "white",
  },
  lightInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  darkInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "white",
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
