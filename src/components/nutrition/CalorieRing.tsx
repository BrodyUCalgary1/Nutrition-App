import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CalorieRingProps = {
  percentage: number; // 0 to 100
  value: string;
  label: string;
  isOver?: boolean;
  size?: number;
};

export default function CalorieRing({
  percentage,
  value,
  label,
  isOver = false,
  size = 150,
}: CalorieRingProps) {
  const theme = useTheme();

  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (Math.min(Math.max(percentage, 0), 100) / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* The faint full circle behind */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={theme.primarySoft}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* The coloured arc on top */}
        {filled > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={isOver ? theme.danger : theme.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            rotation={-90}
            origin={`${center}, ${center}`}
          />
        )}
      </Svg>

      <View style={styles.center}>
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 32,
    fontWeight: "700",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
});
