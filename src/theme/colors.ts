import type { PaletteMode } from "@mui/material";

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      // In dark mode, use slightly lighter/softer colors for better contrast
      main: mode === "light" ? "#0066ff" : "#4a9eff",
      light: mode === "light" ? "#eaf2ff" : "#6fb0ff",
      dark: mode === "light" ? "#0052cc" : "#3380e6",
      contrastText: "#ffffff",
    },
    secondary: {
      // Softer red in dark mode
      main: mode === "light" ? "#dc004e" : "#ff4081",
      light: mode === "light" ? "#ff5983" : "#ff79b0",
      dark: mode === "light" ? "#9a0036" : "#c51162",
      contrastText: "#ffffff",
    },
    background: {
      default: mode === "light" ? "#f5f5f5" : "#121212",
      paper: mode === "light" ? "#ffffff" : "#1e1e1e",
    },
    text: {
      primary: mode === "light" ? "#2c3e50" : "#e0e0e0",
      secondary: mode === "light" ? "#546e7a" : "#b0b0b0",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
    },
    divider:
      mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
  },
});

// Legacy export for backward compatibility
export const colors = getDesignTokens("light").palette;
