import FoodLibrary from "@/components/nutrition/FoodLibrary";
import { getLocalDateString } from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { useState } from "react";
import { ScrollView, Text, useColorScheme } from "react-native";

export default function LibraryScreen() {
  const { savedFoods, addFood, deleteSavedFood } = useNutrition();
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = useColorScheme() === "dark";

  const filteredFoods = savedFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#090909" : "#f5f5f5" }}
      contentContainerStyle={{
        padding: 20,
        paddingTop: 60,
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 15,
          color: isDarkMode ? "#ffffff" : "#222222",
        }}
      >
        Food Library
      </Text>

      <FoodLibrary
        filteredFoods={filteredFoods}
        searchQuery={searchQuery}
        isSearchFocused={true}
        isDarkMode={isDarkMode}
        onSearchChange={setSearchQuery}
        onSearchFocus={() => {}}
        onSearchBlur={() => {}}
        onAddFood={(food) => addFood(food, getLocalDateString())}
        onDeleteFood={deleteSavedFood}
      />
    </ScrollView>
  );
}
