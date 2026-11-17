import BarcodeScanner from "@/components/nutrition/BarcodeScanner";
import NutritionInputs from "@/components/nutrition/NutritionInputs";
import { getLocalDateString } from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  Text,
  View,
  useColorScheme,
} from "react-native";

export default function AddFoodScreen() {
  const { addFood, saveFoodToLibrary } = useNutrition();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const textColor = isDarkMode ? "#ffffff" : "#222222";

  if (isScannerOpen) {
    return (
      <BarcodeScanner
        onClose={() => setIsScannerOpen(false)}
        onAddFood={(food) => {
          addFood(food, getLocalDateString());
          router.back();
        }}
        onSaveFood={saveFoodToLibrary}
      />
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#090909" : "#f5f5f5" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold", color: textColor }}>
          Add food
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#2563EB", fontSize: 16 }}>Close</Text>
        </Pressable>
      </View>

      <NutritionInputs
        onSave={(data) => {
          addFood(data, getLocalDateString());
          saveFoodToLibrary(data);
          router.back();
        }}
      />

      <Button title="Scan Barcode" onPress={() => setIsScannerOpen(true)} />
    </ScrollView>
  );
}
