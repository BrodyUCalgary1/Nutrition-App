import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  backgroundColor: string;
  onPress: () => void;
};

export default function IconButton({
  icon,
  label,
  color,
  backgroundColor,
  onPress,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      style={[styles.button, { backgroundColor }]}
    >
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
