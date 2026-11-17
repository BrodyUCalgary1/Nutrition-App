/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import "@/global.css";

import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#0F1B33",
    textSecondary: "#5B6B8A",
    background: "#EEF3FC",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#E3ECFD",
    card: "#FFFFFF",
    border: "#D5DFF2",
    primary: "#2563EB",
    primaryText: "#1D4FD8",
    primarySoft: "#E3ECFD",
    accent: "#F59E0B",
    accentSoft: "#FDEFD6",
    danger: "#DC2626",
  },
  dark: {
    text: "#F2F5FC",
    textSecondary: "#9AA8C7",
    background: "#0A1020",
    backgroundElement: "#141C30",
    backgroundSelected: "#1B2A4D",
    card: "#141C30",
    border: "#26324F",
    primary: "#3B82F6",
    primaryText: "#8DB4FF",
    primarySoft: "#1B2A4D",
    accent: "#FBBF24",
    accentSoft: "#3A2F12",
    danger: "#F87171",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
