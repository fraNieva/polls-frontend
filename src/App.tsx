import { ThemeProvider } from "@mui/material/styles";
import { getTheme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Store } from "./store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeModeProvider } from "./theme/ThemeModeContext";
import { useThemeMode } from "./hooks";
import { useMemo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store";
import { getCurrentUser } from "./store/slices/authSlice";

function AppContent() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => getTheme(mode), [mode]);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Fetch current user on app mount if authenticated but no user data
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getCurrentUser());
    }
  }, [isAuthenticated, user, dispatch]);

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
