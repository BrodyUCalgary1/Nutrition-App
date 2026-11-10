import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SavedFood } from "./NutritionInputs";

type FoodLibraryProps = {
  filteredFoods: SavedFood[];
  searchQuery: string;
  isSearchFocused: boolean;
  isDarkMode: boolean;
  onSearchChange: (query: string) => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onAddFood: (food: SavedFood) => void;
  onDeleteFood: (id: string) => void;
};

export default function FoodLibrary({
  filteredFoods,
  searchQuery,
  isSearchFocused,
  isDarkMode,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onAddFood,
  onDeleteFood,
}: FoodLibraryProps) {
  return (
    <View>
      {/*Search Bar*/}
      <TextInput
        placeholder="Search saved foods..."
        value={searchQuery}
        onChangeText={onSearchChange}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
        style={[
          styles.searchInput,
          isDarkMode ? styles.darkInput : styles.lightInput,
        ]}
      />
      {isSearchFocused && (
        <>
          {filteredFoods.map((food) => (
            <View
              style={[
                styles.foodItem,
                isDarkMode ? styles.darkCard : styles.lightCard,
              ]}
              key={food.id}
            >
              <View style={styles.foodInfo}>
                <Text
                  style={[
                    styles.foodName,
                    isDarkMode ? styles.darkText : styles.lightText,
                  ]}
                >
                  {food.name}
                </Text>
                <Text style={isDarkMode ? styles.darkText : styles.lightText}>
                  {food.calories} calories | {food.protein}g protein
                </Text>
              </View>

              <Button title="Add" onPress={() => onAddFood(food)} />
              <Button
                title="Delete"
                onPress={() => onDeleteFood(food.id)}
                color="red"
              />
            </View>
          ))}

          {filteredFoods.length === 0 && (
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              No foods found. Try another search.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  darkText: {
    color: "#ffffff",
  },

  lightText: {
    color: "#222222",
  },
  darkCard: {
    backgroundColor: "#242424",
    borderColor: "#444444",
  },

  lightCard: {
    backgroundColor: "#ffffff",
    borderColor: "#dddddd",
  },
});
