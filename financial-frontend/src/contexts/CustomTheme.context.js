import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";

export const CustomThemeContext = React.createContext();

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1500,
    },
  },
  palette: {
    login: {
      main: "#3f3f3f",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
    register: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
    transfer: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
    colors: {
      main: "#483433",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function CustomThemeProvider({ children }) {
  return (
    <CustomThemeContext.Provider value={{ theme }}>
      {children}
    </CustomThemeContext.Provider>
  );
}
