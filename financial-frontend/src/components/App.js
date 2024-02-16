import React, { memo } from "react";

import "../styles/App.css";
import AuthProvider from "../contexts/Auth.context";
import CustomThemeProvider from "../contexts/CustomTheme.context";
import MonthProvider from "../contexts/Month.context";
import FinanceProvider from "../contexts/Finance.context";
import AppRouter from "./AppRouter";
import { BrowserRouter } from "react-router-dom";

export default memo(function App() {
  return <MainApp />;
});

function MainApp() {
  return (
    <div className="App">
      <BrowserRouter>
        <CustomThemeProvider>
          <AuthProvider>
            <MonthProvider>
              <FinanceProvider>
                <AppRouter />
              </FinanceProvider>
            </MonthProvider>
          </AuthProvider>
        </CustomThemeProvider>
      </BrowserRouter>
    </div>
  );
}
