import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Store } from "./store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeModeProvider } from "./theme/ThemeModeContext";
import { useThemeMode } from "./hooks";
import { useMemo } from "react";

function AppContent() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={Store}>
      <ThemeModeProvider>
        <AppContent />
      </ThemeModeProvider>
    </Provider>
  );
}

export default App;
