import FoodLibrary from "@/components/nutrition/FoodLibrary";
import { getLocalDateString } from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, Text } from "react-native";

export default function LibraryScreen() {
  const { savedFoods, addFood, deleteSavedFood } = useNutrition();
  const [searchQuery, setSearchQuery] = useState("");
  const theme = useTheme();

  const filteredFoods = savedFoods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 120,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 16,
          color: theme.text,
        }}
      >
        Food library
      </Text>

      <FoodLibrary
        filteredFoods={filteredFoods}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddFood={(food) => addFood(food, getLocalDateString())}
        onDeleteFood={deleteSavedFood}
      />
    </ScrollView>
  );
}
