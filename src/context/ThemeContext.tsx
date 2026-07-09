import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "app:v1:darkmode";

type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtitle: string;
  border: string;
  accent: string;
  button: string;
};

function getColors(dark: boolean): ThemeColors {
  if (dark) {
    return {
      background: "#0f1724",
      card: "#0b1220",
      text: "#e6eef6",
      subtitle: "#8fbde6",
      border: "#22303f",
      accent: "#ff8a00",
      button: "#2492d1",
    };
  }
  return {
    background: "#ffffff",
    card: "#ffffff",
    text: "#0b1220",
    subtitle: "#2492d1",
    border: "#eeeeee",
    accent: "#fc7a00",
    button: "#2492d1",
  };
}

const ThemeContext = React.createContext<{
  dark: boolean;
  colors: ThemeColors;
  toggle: () => Promise<void>;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = React.useState(false);
  const colors = React.useMemo(() => getColors(dark), [dark]);

  React.useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((v) => {
        if (v === "1") setDark(true);
      })
      .catch(() => {});
  }, []);

  async function toggle() {
    const next = !dark;
    setDark(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  const value = React.useMemo(() => ({ dark, colors, toggle }), [dark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
