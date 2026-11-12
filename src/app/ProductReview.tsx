import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import type { NutritionEntry, SavedFood } from "./NutritionInputs";
import type { ServingNutrition } from "./NutritionUtils";
import type { ProductData } from "./ProductLookup";

type ProductReviewProps = {
  product: ProductData;
  servingGrams: string;
  nutrition: ServingNutrition | null;
  onServingChange: (value: string) => void;
  onAddFood: (food: NutritionEntry) => void;
  onSaveFood: (food: Omit<SavedFood, "id">) => void;
};

export default function ProductReview({
  product,
  servingGrams,
  nutrition,
  onServingChange,
  onAddFood,
  onSaveFood,
}: ProductReviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>

      <Text>{product.brand || "Unknown brand"}</Text>
      <Text>Barcode: {product.barcode}</Text>

      <Text style={styles.heading}>Serving Amount</Text>

      <TextInput
        style={styles.input}
        value={servingGrams}
        onChangeText={onServingChange}
        keyboardType="decimal-pad"
        placeholder="Enter grams"
      />

      <Text style={styles.heading}>Nutrition Information</Text>

      {nutrition ? (
        <View>
          <Text>Calories: {nutrition.calories ?? "Unavailable"} kcal</Text>
          <Text>Protein: {nutrition.protein ?? "Unavailable"} g</Text>
          <Text>Carbs: {nutrition.carbs ?? "Unavailable"} g</Text>
          <Text>Fat: {nutrition.fat ?? "Unavailable"} g</Text>
        </View>
      ) : (
        <Text>Enter a valid serving amount to calculate nutrition.</Text>
      )}

      <Button
        title="Add to Daily Log"
        disabled={
          nutrition === null ||
          nutrition.calories === null ||
          nutrition.protein === null
        }
        onPress={() => {
          if (
            nutrition === null ||
            nutrition.calories === null ||
            nutrition.protein === null
          ) {
            return;
          }

          onAddFood({
            name: product.name,
            calories: nutrition.calories,
            protein: nutrition.protein,
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: "100%",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});
