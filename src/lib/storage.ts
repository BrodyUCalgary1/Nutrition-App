import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DailyFoods, NutritionGoal, SavedFood } from "../types/nutrition";

// ---------- Small checks ----------

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isOptionalNumberOrNull(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "number" && Number.isFinite(value))
  );
}

// ---------- What a valid item looks like ----------

export function isDailyFood(value: unknown): value is DailyFoods {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isNonNegativeNumber(value.calories) &&
    isNonNegativeNumber(value.protein) &&
    typeof value.date === "string" &&
    DATE_PATTERN.test(value.date)
  );
}

export function isSavedFood(value: unknown): value is SavedFood {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isNonNegativeNumber(value.calories) &&
    isNonNegativeNumber(value.protein) &&
    isOptionalString(value.barcode) &&
    isOptionalString(value.brand) &&
    isOptionalString(value.quantity) &&
    isOptionalNumberOrNull(value.servingGrams) &&
    isOptionalNumberOrNull(value.caloriesPer100g) &&
    isOptionalNumberOrNull(value.proteinPer100g) &&
    isOptionalNumberOrNull(value.carbsPer100g) &&
    isOptionalNumberOrNull(value.fatPer100g)
  );
}

export function isNutritionGoal(value: unknown): value is NutritionGoal {
  return (
    isRecord(value) &&
    typeof value.calorieGoal === "number" &&
    Number.isFinite(value.calorieGoal) &&
    value.calorieGoal > 0 &&
    typeof value.proteinGoal === "number" &&
    Number.isFinite(value.proteinGoal) &&
    value.proteinGoal > 0
  );
}

// ---------- Loading ----------

// Keep a copy of data we couldn't use, so nothing is lost for good
async function keepBackup(key: string, raw: string) {
  try {
    await AsyncStorage.setItem(`${key}:backup`, raw);
  } catch (error) {
    console.warn(`Could not back up "${key}":`, error);
  }
}

export async function loadList<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn(`Stored "${key}" is not valid JSON. Starting empty.`);
    await keepBackup(key, raw);
    return [];
  }

  if (!Array.isArray(parsed)) {
    console.warn(`Stored "${key}" is not a list. Starting empty.`);
    await keepBackup(key, raw);
    return [];
  }

  const valid = parsed.filter(isValid);
  const dropped = parsed.length - valid.length;

  if (dropped > 0) {
    console.warn(`Dropped ${dropped} invalid entries from "${key}".`);
    await keepBackup(key, raw);
  }

  return valid;
}

export async function loadObject<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn(`Stored "${key}" is not valid JSON. Ignoring it.`);
    await keepBackup(key, raw);
    return null;
  }

  // The app saves "no goals set" as the text "null", which is fine
  if (parsed === null) return null;

  if (!isValid(parsed)) {
    console.warn(`Stored "${key}" has the wrong shape. Ignoring it.`);
    await keepBackup(key, raw);
    return null;
  }

  return parsed;
}
