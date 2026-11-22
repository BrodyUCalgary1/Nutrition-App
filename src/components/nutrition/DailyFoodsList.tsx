import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";
import type { DailyFoods } from "../../types/nutrition";
import IconButton from "./IconButton";
import { formatNumber } from "./NutritionUtils";

type DailyFoodListProps = {
  foods: DailyFoods[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function DailyFoodList({
  foods,
  onEdit,
  onDelete,
}: DailyFoodListProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.text }]}>
          Logged foods
        </Text>
        <Text style={[styles.count, { color: theme.textSecondary }]}>
          {foods.length} {foods.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {foods.length === 0 ? (
        <View style={[styles.empty, { backgroundColor: theme.card }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Nothing logged for this day.
          </Text>
        </View>
      ) : (
        foods.map((food) => (
          <View
            key={food.id}
            style={[styles.row, { backgroundColor: theme.card }]}
          >
            <View style={styles.info}>
              <Text style={[styles.name, { color: theme.text }]}>
                {food.name}
              </Text>
              <Text style={[styles.details, { color: theme.textSecondary }]}>
                {Math.round(food.calories)} kcal ·{" "}
                {formatNumber(food.protein, 1)} g protein
              </Text>
            </View>

            <IconButton
              icon="pencil-outline"
              label={`Edit ${food.name}`}
              color={theme.iconEdit}
              backgroundColor={theme.iconEditSoft}
              onPress={() => onEdit(food.id)}
            />
            <IconButton
              icon="trash-outline"
              label={`Delete ${food.name}`}
              color={theme.iconDelete}
              backgroundColor={theme.iconDeleteSoft}
              onPress={() => onDelete(food.id)}
            />
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 6,
    marginBottom: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
  },
  count: {
    fontSize: 13,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  details: {
    fontSize: 13,
    marginTop: 2,
  },
  empty: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});
