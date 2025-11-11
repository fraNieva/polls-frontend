import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Store } from "./store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
