
// Calculate remaining calories
export function calculateRemainingCalories(
  goal: number,
  consumed: number
): number {
  return goal - consumed;
}

// Calculate remaining protein
export function calculateRemainingProtein(
  goal: number,
  consumed: number
): number {
  return goal - consumed;
}

// Calculate percentage of daily calorie goal completed
export function calculateCaloriePercentage(
  goal: number,
  consumed: number
): number {
  if (goal <= 0) return 0;

  return Math.min((consumed / goal) * 100, 100);
}

// Calculate percentage of daily protein goal completed
export function calculateProteinPercentage(
  goal: number,
  consumed: number
): number {
  if (goal <= 0) return 0;

  return Math.min((consumed / goal) * 100, 100);
}
