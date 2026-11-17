import { useNutritionData } from "@/hooks/useNutritionData";
import { createContext, useContext, type ReactNode } from "react";

type NutritionContextValue = ReturnType<typeof useNutritionData>;

const NutritionContext = createContext<NutritionContextValue | null>(null);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const nutrition = useNutritionData();

  return (
    <NutritionContext.Provider value={nutrition}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);

  if (context === null) {
    throw new Error("useNutrition must be used inside a NutritionProvider");
  }

  return context;
}
