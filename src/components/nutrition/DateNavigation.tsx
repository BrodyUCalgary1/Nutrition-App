import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getLocalDateString } from "./NutritionUtils";

const DAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

type DateNavigationProps = {
  selectedDate: string;
  today: string;
  datesWithFoods: Set<string>;
  onSelectDate: (date: string) => void;
  onShiftWeek: (weeks: number) => void;
};

// The 7 dates (Monday to Sunday) of the week containing the given date
function getWeekDates(date: string): string[] {
  const base = new Date(date + "T12:00:00");
  const daysSinceMonday = (base.getDay() + 6) % 7;

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(base);
    day.setDate(base.getDate() - daysSinceMonday + index);
    return getLocalDateString(day);
  });
}

function formatLongDate(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DateNavigation({
  selectedDate,
  today,
  datesWithFoods,
  onSelectDate,
  onShiftWeek,
}: DateNavigationProps) {
  const theme = useTheme();

  const week = getWeekDates(selectedDate);
  const isToday = selectedDate === today;
  const canGoForward = week[6] < today;

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>
          {isToday ? "Today" : formatLongDate(selectedDate)}
        </Text>

        {isToday ? (
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatLongDate(today)}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={() => onSelectDate(today)}
            style={[styles.backButton, { borderColor: theme.primary }]}
          >
            <Text style={[styles.backText, { color: theme.primaryText }]}>
              Back to today
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.weekRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous week"
          hitSlop={8}
          onPress={() => onShiftWeek(-1)}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </Pressable>

        {week.map((date, index) => {
          const isFuture = date > today;
          const isSelected = date === selectedDate;
          const hasFoods = datesWithFoods.has(date);

          const circleStyle = isSelected
            ? { backgroundColor: theme.primary }
            : hasFoods
              ? { backgroundColor: theme.primarySoft }
              : { borderWidth: 1.5, borderColor: theme.border };

          const numberColor = isSelected
            ? "#ffffff"
            : hasFoods
              ? theme.primaryText
              : theme.text;

          return (
            <Pressable
              key={date}
              accessibilityRole="button"
              accessibilityLabel={formatLongDate(date)}
              accessibilityState={{ selected: isSelected, disabled: isFuture }}
              disabled={isFuture}
              onPress={() => onSelectDate(date)}
              style={[styles.day, { opacity: isFuture ? 0.35 : 1 }]}
            >
              <Text style={[styles.dayLetter, { color: theme.textSecondary }]}>
                {DAY_LETTERS[index]}
              </Text>
              <View style={[styles.circle, circleStyle]}>
                <Text style={[styles.dayNumber, { color: numberColor }]}>
                  {Number(date.slice(8))}
                </Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next week"
          disabled={!canGoForward}
          hitSlop={8}
          onPress={() => onShiftWeek(1)}
          style={{ opacity: canGoForward ? 1 : 0.3 }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: "600",
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  day: {
    alignItems: "center",
    gap: 6,
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: "600",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: "600",
  },
});
