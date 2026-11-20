import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NutritionEntry, SavedFood } from "../../types/nutrition";
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

// Round a number and drop trailing zeros: 8.00 -> "8", 6.43 -> "6.4"
function formatNumber(value: number | null, decimals: number): string | null {
  if (value === null) return null;

  return String(Number(value.toFixed(decimals)));
}

type StatTileProps = {
  label: string;
  value: string | null;
  unit: string;
  large?: boolean;
};

function StatTile({ label, value, unit, large }: StatTileProps) {
  const theme = useTheme();

  return (
    <View style={[styles.tile, { backgroundColor: theme.card }]}>
      <Text style={[styles.tileLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>

      {value === null ? (
        <Text style={[styles.unavailable, { color: theme.textSecondary }]}>
          Unavailable
        </Text>
      ) : (
        <Text
          style={[
            large ? styles.tileValueLarge : styles.tileValue,
            { color: theme.text },
          ]}
        >
          {value}
          <Text style={[styles.tileUnit, { color: theme.textSecondary }]}>
            {" "}
            {unit}
          </Text>
        </Text>
      )}
    </View>
  );
}

export default function ProductReview({
  product,
  servingGrams,
  nutrition,
  onServingChange,
  onAddFood,
  onSaveFood,
}: ProductReviewProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const canAdd =
    nutrition !== null &&
    nutrition.calories !== null &&
    nutrition.protein !== null;

  function handleAdd() {
    if (
      nutrition === null ||
      nutrition.calories === null ||
      nutrition.protein === null
    ) {
      return;
    }

    // Round once here so the log and the library store clean numbers
    const calories = Math.round(nutrition.calories);
    const protein = Math.round(nutrition.protein * 10) / 10;

    onAddFood({
      name: product.name,
      calories,
      protein,
    });

    onSaveFood({
      name: product.name,
      calories,
      protein,

      barcode: product.barcode,
      brand: product.brand,
      quantity: product.quantity,
      servingGrams: Number(servingGrams),

      caloriesPer100g: product.caloriesPer100g,
      proteinPer100g: product.proteinPer100g,
      carbsPer100g: product.carbsPer100g,
      fatPer100g: product.fatPer100g,
    });
  }

  return (
    <View style={styles.root}>
      <ScrollView>
        {/* Product card */}
        <View style={[styles.productCard, { backgroundColor: theme.card }]}>
          <View
            style={[styles.productIcon, { backgroundColor: theme.primarySoft }]}
          >
            <Ionicons
              name="barcode-outline"
              size={28}
              color={theme.primaryText}
            />
          </View>

          <View style={styles.productInfo}>
            <Text style={[styles.productName, { color: theme.text }]}>
              {product.name}
            </Text>
            <Text style={[styles.productBrand, { color: theme.textSecondary }]}>
              {product.brand || "Unknown brand"}
            </Text>
            <Text
              style={[styles.productBarcode, { color: theme.textSecondary }]}
            >
              Barcode {product.barcode}
            </Text>
          </View>
        </View>

        {/* Serving amount */}
        <View>
          <Text style={[styles.heading, { color: theme.text }]}>
            Serving amount
          </Text>

          <View style={styles.servingWrapper}>
            <TextInput
              accessibilityLabel="Serving amount in grams"
              style={[
                styles.servingInput,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.primary,
                  color: theme.text,
                },
              ]}
              value={servingGrams}
              onChangeText={onServingChange}
              keyboardType="decimal-pad"
              placeholder="Enter grams"
              placeholderTextColor={theme.textSecondary}
            />
            <Text style={[styles.servingUnit, { color: theme.textSecondary }]}>
              g
            </Text>
          </View>
        </View>

        {/* Nutrition */}
        <View style={styles.nutritionHeader}>
          <Text style={[styles.heading, { color: theme.text }]}>Nutrition</Text>
          {nutrition && (
            <Text style={[styles.forServing, { color: theme.textSecondary }]}>
              for {servingGrams} g
            </Text>
          )}
        </View>

        {nutrition ? (
          <View style={styles.tiles}>
            <View style={styles.tileRow}>
              <StatTile
                label="CALORIES"
                value={formatNumber(nutrition.calories, 0)}
                unit="kcal"
                large
              />
              <StatTile
                label="PROTEIN"
                value={formatNumber(nutrition.protein, 1)}
                unit="g"
                large
              />
            </View>
            <View style={styles.tileRow}>
              <StatTile
                label="CARBS"
                value={formatNumber(nutrition.carbs, 1)}
                unit="g"
              />
              <StatTile
                label="FAT"
                value={formatNumber(nutrition.fat, 1)}
                unit="g"
              />
            </View>
          </View>
        ) : (
          <Text style={[styles.note, { color: theme.textSecondary }]}>
            Enter a valid serving amount to calculate nutrition.
          </Text>
        )}

        <Text style={[styles.note, { color: theme.textSecondary }]}>
          Values are calculated from the per-100 g data on Open Food Facts.
          Anything the product is missing shows as Unavailable.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          accessibilityRole="button"
          disabled={!canAdd}
          onPress={handleAdd}
          style={[
            styles.addButton,
            { backgroundColor: theme.primary, opacity: canAdd ? 1 : 0.4 },
          ]}
        >
          <Text style={styles.addButtonText}>Add to daily log</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  productIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
  },
  productBrand: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  productBarcode: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
  },
  servingWrapper: {
    marginTop: 10,
    justifyContent: "center",
  },
  servingInput: {
    height: 56,
    borderWidth: 2,
    borderRadius: 14,
    paddingLeft: 16,
    paddingRight: 44,
    paddingVertical: 0,
    fontSize: 20,
    fontWeight: "600",
  },
  servingUnit: {
    position: "absolute",
    right: 16,
    fontSize: 15,
    fontWeight: "500",
  },
  nutritionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  forServing: {
    fontSize: 13,
    fontWeight: "500",
  },
  tiles: {
    gap: 10,
  },
  tileRow: {
    flexDirection: "row",
    gap: 10,
  },
  tile: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
  },
  tileValueLarge: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  tileValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  tileUnit: {
    fontSize: 12,
    fontWeight: "500",
  },
  unavailable: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  note: {
    fontSize: 13,
    lineHeight: 19,
    marginHorizontal: 4,
  },
  addButton: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
});
