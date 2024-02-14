import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthContext } from "../contexts/Auth.context";
import Navbar from "./Navbar";
import FinancialInfoPage from "./FinancialInfoPage";
import MainPage from "./MainPage";
import Logout from "./Logout";
import Login from "./forms/Login";
import Wishes from "./Wishes";
import ErrorPage from "./ErrorPage";
import "../styles/AllTransactions.css";
import "../styles/NavigationBar.css";

import "react-datepicker/dist/react-datepicker.css";

import { FinanceContext } from "../contexts/Finance.context";

export default function AppRouter() {
  const auth = React.useContext(AuthContext);
  const { financeState, error } = React.useContext(FinanceContext);

  const toRender = financeState.generalStructure ? (
    auth.isAuthenticated ? (
      <div className="AllTransactions">
        <Navbar />

        <BrowserRouter>
          <Routes>
            <Route path="/" index element={<MainPage />} />
            <Route
              path="expenses"
              element={<FinancialInfoPage typeName="Expenses" />}
            />
            <Route
              path="incomes"
              element={<FinancialInfoPage typeName="Incomes" />}
            />
            <Route
              path="savings"
              element={<FinancialInfoPage typeName="Savings" />}
            />
            <Route path="wishes" element={<Wishes />} />
            <Route path="logout" element={<Logout />} />
            <Route
              path="*"
              element={
                <ErrorPage
                  error={{
                    isError: true,
                    message: "404. Such page does not exist 😢",
                  }}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    ) : (
      <Login />
    )
  ) : (
    <div className="AllTransactions">
      <Navbar />
      {error.isError ? <ErrorPage error={error} /> : null}
    </div>
  );
  return toRender;
}
