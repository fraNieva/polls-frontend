import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { Store } from "./store";

function App() {
  return (
    <Provider store={Store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
