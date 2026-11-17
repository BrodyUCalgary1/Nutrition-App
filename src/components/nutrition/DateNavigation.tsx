import { Button, StyleSheet, Text, TextStyle, View } from "react-native";

type DateNavigationProps = {
  selectedDate: string;
  changeDate: (days: number) => void;
  isToday: boolean;
  textStyle: TextStyle;
};

export default function DateNavigation({
  selectedDate,
  changeDate,
  isToday,
  textStyle,
}: DateNavigationProps) {
  return (
    <View style={styles.dateNavigation}>
      <Button title="Previous Day" onPress={() => changeDate(-1)} />

      <Text style={textStyle}>{selectedDate}</Text>

      <Button
        title="Next Day"
        onPress={() => changeDate(1)}
        disabled={isToday}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dateNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    gap: 8,
  },
});
