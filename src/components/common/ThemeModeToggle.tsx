import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useThemeMode } from "../../hooks";

export const ThemeModeToggle = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Tooltip
      title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <IconButton
        onClick={toggleMode}
        color="inherit"
        aria-label="toggle theme mode"
        sx={{
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "rotate(180deg)",
          },
        }}
      >
        {mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};
