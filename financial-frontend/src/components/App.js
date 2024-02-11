import React, { memo } from "react";

import "../styles/App.css";
import AuthProvider from "../contexts/Auth.context";
import CustomThemeProvider from "../contexts/CustomTheme.context";
import AppRouter from "./AppRouter";

export default memo(function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <MainApp />
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
