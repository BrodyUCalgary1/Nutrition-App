import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";
import type { SavedFood } from "../../types/nutrition";
import IconButton from "./IconButton";

type FoodLibraryProps = {
  filteredFoods: SavedFood[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddFood: (food: SavedFood) => void;
  onDeleteFood: (id: string) => void;
};

export default function FoodLibrary({
  filteredFoods,
  searchQuery,
  onSearchChange,
  onAddFood,
  onDeleteFood,
}: FoodLibraryProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.search,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search-outline" size={18} color={theme.textSecondary} />
        <TextInput
          placeholder="Search saved foods"
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {filteredFoods.map((food) => (
        <View
          key={food.id}
          style={[styles.row, { backgroundColor: theme.card }]}
        >
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>
              {food.name}
            </Text>
            <Text style={[styles.details, { color: theme.textSecondary }]}>
              {food.calories} kcal · {food.protein} g protein
            </Text>
          </View>

          <IconButton
            icon="add"
            label={`Add ${food.name} to today`}
            color={theme.iconAdd}
            backgroundColor={theme.iconAddSoft}
            onPress={() => onAddFood(food)}
          />
          <IconButton
            icon="trash-outline"
            label={`Delete ${food.name} from library`}
            color={theme.iconDelete}
            backgroundColor={theme.iconDeleteSoft}
            onPress={() => onDeleteFood(food.id)}
          />
        </View>
      ))}

      {filteredFoods.length === 0 && (
        <Text style={[styles.empty, { color: theme.textSecondary }]}>
          No foods found. Try another search.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
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
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
});
