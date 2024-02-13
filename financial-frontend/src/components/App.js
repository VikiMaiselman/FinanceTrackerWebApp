import React, { memo } from "react";

import "../styles/App.css";
import AuthProvider from "../contexts/Auth.context";
import CustomThemeProvider from "../contexts/CustomTheme.context";
import MonthProvider from "../contexts/Month.context";
import AppRouter from "./AppRouter";

export default memo(function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <MonthProvider>
          <MainApp />
        </MonthProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
});

function MainApp() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}
