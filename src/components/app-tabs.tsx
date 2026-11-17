import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabButtonProps = ComponentProps<typeof Pressable> & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isFocused?: boolean;
};

function TabButton({ label, icon, isFocused, ...props }: TabButtonProps) {
  const theme = useTheme();
  const color = isFocused ? theme.primaryText : theme.textSecondary;

  return (
    <Pressable
      {...props}
      style={[styles.tab, isFocused && { backgroundColor: theme.primarySoft }]}
    >
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

export default function AppTabs() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <Tabs>
      <TabSlot />
      <TabList
        style={[
          styles.pill,
          {
            bottom: insets.bottom + 12,
            backgroundColor: theme.card,
            shadowColor: theme.primary,
          },
        ]}
      >
        <TabTrigger name="index" href="/" asChild>
          <TabButton label="Today" icon="home-outline" />
        </TabTrigger>
        <TabTrigger name="library" href="/library" asChild>
          <TabButton label="Library" icon="bookmark-outline" />
        </TabTrigger>
        <TabTrigger name="goals" href="/goals" asChild>
          <TabButton label="Goals" icon="locate-outline" />
        </TabTrigger>
      </TabList>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add food"
        onPress={() => router.push("/add-food")}
        style={[
          styles.fab,
          {
            bottom: insets.bottom + 12,
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
          },
        ]}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </Pressable>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: "absolute",
    left: 20,
    right: 96,
    height: 64,
    padding: 6,
    gap: 4,
    flexDirection: "row",
    borderRadius: 32,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: 26,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
