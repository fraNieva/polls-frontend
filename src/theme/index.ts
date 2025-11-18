import { createTheme } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import { getDesignTokens } from "./colors";
import { typography } from "./typography";
import { components } from "./components";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    ...getDesignTokens(mode),
    typography,
    components,
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
  });

// Default light theme for backward compatibility
export const theme = getTheme("light");

export { colors } from "./colors";
