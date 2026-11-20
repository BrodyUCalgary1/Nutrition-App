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
  iconColor: string;
  labelColor: string;
  softColor: string;
  isFocused?: boolean;
};

function TabButton({
  label,
  icon,
  iconColor,
  labelColor,
  softColor,
  isFocused,
  ...props
}: TabButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      style={[styles.tab, isFocused && { backgroundColor: softColor }]}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text
        style={[
          styles.label,
          { color: isFocused ? labelColor : theme.textSecondary },
        ]}
      >
        {label}
      </Text>
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
          },
        ]}
      >
        <TabTrigger name="index" href="/" asChild>
          <TabButton
            label="Today"
            icon="home-outline"
            iconColor={theme.tabToday}
            labelColor={theme.tabTodayText}
            softColor={theme.tabTodaySoft}
          />
        </TabTrigger>
        <TabTrigger name="library" href="/library" asChild>
          <TabButton
            label="Library"
            icon="bookmark-outline"
            iconColor={theme.tabLibrary}
            labelColor={theme.tabLibraryText}
            softColor={theme.tabLibrarySoft}
          />
        </TabTrigger>
        <TabTrigger name="goals" href="/goals" asChild>
          <TabButton
            label="Goals"
            icon="locate-outline"
            iconColor={theme.tabGoals}
            labelColor={theme.tabGoalsText}
            softColor={theme.tabGoalsSoft}
          />
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
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
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
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
