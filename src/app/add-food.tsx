import BarcodeScanner from "@/components/nutrition/BarcodeScanner";
import NutritionInputs from "@/components/nutrition/NutritionInputs";
import { getLocalDateString } from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddFoodScreen() {
  const { addFood, saveFoodToLibrary } = useNutrition();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

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
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "ios" ? 24 : insets.top + 16 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>Add food</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: theme.card }]}
        >
          <Ionicons name="close" size={22} color={theme.text} />
        </Pressable>
      </View>

      <NutritionInputs
        onSave={(data) => {
          addFood(data, getLocalDateString());
          saveFoodToLibrary(data);
          router.back();
        }}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => setIsScannerOpen(true)}
        style={[
          styles.scanButton,
          { backgroundColor: theme.card, borderColor: theme.primary },
        ]}
      >
        <Ionicons name="scan-outline" size={20} color={theme.primaryText} />
        <Text style={[styles.scanText, { color: theme.primaryText }]}>
          Scan barcode
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scanButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  scanText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
