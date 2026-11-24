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
    tabToday: "#2F5FCB",
    tabTodayText: "#1D4FD8",
    tabTodaySoft: "#E3ECFD",
    tabLibrary: "#2F8F83",
    tabLibraryText: "#1F6F65",
    tabLibrarySoft: "#DDF1EE",
    tabGoals: "#7B5CC4",
    tabGoalsText: "#5B3FA8",
    tabGoalsSoft: "#ECE6F8",
    iconAdd: "#3A9A6A",
    iconAddSoft: "#DFF2E8",
    iconEdit: "#3B6FD8",
    iconEditSoft: "#E3ECFD",
    iconDelete: "#C0504D",
    iconDeleteSoft: "#F8E4E3",
  },
  dark: {
    text: "#F2F4F8",
    textSecondary: "#9AA3B5",
    background: "#0E1118",
    backgroundElement: "#171B24",
    backgroundSelected: "#222838",
    card: "#171B24",
    border: "#292F3D",
    primary: "#3B82F6",
    primaryText: "#8DB4FF",
    primarySoft: "#1B2A4D",
    accent: "#FBBF24",
    accentSoft: "#3A2F12",
    danger: "#F87171",
    tabToday: "#8DB4FF",
    tabTodayText: "#8DB4FF",
    tabTodaySoft: "#1B2A4D",
    tabLibrary: "#5CC4B4",
    tabLibraryText: "#5CC4B4",
    tabLibrarySoft: "#16322F",
    tabGoals: "#B6A0F0",
    tabGoalsText: "#B6A0F0",
    tabGoalsSoft: "#2A2347",
    iconAdd: "#6FD3A0",
    iconAddSoft: "#173626",
    iconEdit: "#8DB4FF",
    iconEditSoft: "#1B2A4D",
    iconDelete: "#F29A98",
    iconDeleteSoft: "#3D2224",
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
