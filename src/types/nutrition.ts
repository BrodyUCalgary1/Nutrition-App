export type NutritionEntry = {
  name: string;
  calories: number;
  protein: number;
};

export type SavedFood = NutritionEntry & {
  id: string;

  barcode?: string;
  brand?: string;
  quantity?: string;
  servingGrams?: number;

  caloriesPer100g?: number | null;
  proteinPer100g?: number | null;
  carbsPer100g?: number | null;
  fatPer100g?: number | null;
};

export type DailyFoods = NutritionEntry & {
  id: string;
  date: string;
};

export type NutritionGoal = {
  calorieGoal: number;
  proteinGoal: number;
};
