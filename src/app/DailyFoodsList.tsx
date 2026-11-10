import { Button, StyleSheet, Text, TextStyle, View } from "react-native";
import { DailyFoods } from "./NutritionInputs";

type DailyFoodListProps = {
  foods: DailyFoods[];
  textStyle: TextStyle;
  isDarkMode: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function DailyFoodList({
  foods,
  textStyle,
  isDarkMode,
  onEdit,
  onDelete,
}: DailyFoodListProps) {
  return (
    <View>
      {foods.length > 0 && (
        <View
          style={[
            styles.results,
            isDarkMode ? styles.darkCard : styles.lightCard,
          ]}
        >
          <Text style={[styles.heading, textStyle]}>Foods for This Day</Text>

          {foods.map((food) => (
            <View key={food.id} style={styles.dailyFood}>
              <Text style={textStyle}>Food: {food.name}</Text>
              <Text style={textStyle}>Calories: {food.calories}</Text>
              <Text style={textStyle}>Protein: {food.protein}g</Text>

              <Button title="Delete" onPress={() => onDelete(food.id)} />
              <Button title="Edit" onPress={() => onEdit(food.id)} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
  },

  dailyFood: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#777777",
    gap: 5,
  },
});
