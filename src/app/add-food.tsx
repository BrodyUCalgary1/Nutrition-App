import BarcodeScanner from "@/components/nutrition/BarcodeScanner";
import NutritionInputs from "@/components/nutrition/NutritionInputs";
import { getLocalDateString } from "@/components/nutrition/NutritionUtils";
import { useNutrition } from "@/context/NutritionContext";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { foods, addFood, editFood, saveFoodToLibrary } = useNutrition();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  // If an id was passed in, we're editing that food
  const isEditing = id !== undefined;
  const editingFood = isEditing
    ? foods.find((food) => food.id === id)
    : undefined;

  const topPadding = Platform.OS === "ios" ? 24 : insets.top + 16;

  // The id points at a food that doesn't exist (for example it was deleted)
  if (isEditing && !editingFood) {
    return (
      <View
        style={[
          styles.missing,
          { backgroundColor: theme.background, paddingTop: topPadding },
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>
          Food not found
        </Text>
        <Text style={[styles.missingText, { color: theme.textSecondary }]}>
          This food no longer exists.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={[styles.closeTextButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.closeTextButtonLabel}>Close</Text>
        </Pressable>
      </View>
    );
  }

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
      contentContainerStyle={[styles.content, { paddingTop: topPadding }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>
          {editingFood ? "Edit food" : "Add food"}
        </Text>
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
        initialData={editingFood}
        onCancel={() => router.back()}
        onSave={(data) => {
          if (editingFood) {
            editFood(editingFood.id, data);
          } else {
            addFood(data, getLocalDateString());
            saveFoodToLibrary(data);
          }
          router.back();
        }}
      />

      {!editingFood && (
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
      )}
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
  missing: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 14,
  },
  missingText: {
    fontSize: 15,
  },
  closeTextButton: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  closeTextButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
