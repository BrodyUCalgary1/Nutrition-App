import type { ProductData } from "./ProductLookup";
// Calculate remaining calories
export function calculateRemainingCalories(
  goal: number,
  consumed: number,
): number {
  return goal - consumed;
}

// Calculate remaining protein
export function calculateRemainingProtein(
  goal: number,
  consumed: number,
): number {
  return goal - consumed;
}

// Calculate percentage of daily calorie goal completed
export function calculateCaloriePercentage(
  goal: number,
  consumed: number,
): number {
  if (goal <= 0) return 0;

  return Math.min((consumed / goal) * 100, 100);
}

// Calculate percentage of daily protein goal completed
export function calculateProteinPercentage(
  goal: number,
  consumed: number,
): number {
  if (goal <= 0) return 0;

  return Math.min((consumed / goal) * 100, 100);
}

export type ServingNutrition = {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
};

export function calculateServingNutrition(
  product: ProductData,
  servingGrams: number,
): ServingNutrition {
  const multiplier = servingGrams / 100;

  return {
    calories:
      product.caloriesPer100g === null
        ? null
        : product.caloriesPer100g * multiplier,

    protein:
      product.proteinPer100g === null
        ? null
        : product.proteinPer100g * multiplier,

    carbs:
      product.carbsPer100g === null ? null : product.carbsPer100g * multiplier,

    fat: product.fatPer100g === null ? null : product.fatPer100g * multiplier,
  };
}
