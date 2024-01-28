import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { createTheme } from "@mui/material";
import axios from "axios";

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
import { addMonths } from "date-fns";

import useFinanceState from "../hooks/useFinanceState";
import { url, headers } from "../helpers";

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
});

export default function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useStateWithCallbackLazy(false);

  const [
    financeState,
    fetchData,
    addTransaction,
    updateTransaction,
    removeTransaction,
    transfer,
    error,
    errorHandler,
    selectedDate,
    setSelectedDate,
  ] = useFinanceState();

  useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${url}/authstatus`,
          { withCredentials: true },
          headers
        );
        setIsAuthenticated(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAuthStatus();
    fetchData();
  }, [isAuthenticated]);

  const handleDataChange = (date) => {
    setSelectedDate(date);
  };
  const handlePrevMonth = async () => {
    setSelectedDate(addMonths(selectedDate, -1));
  };
  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleMonths = {
    handlePrevMonth: handlePrevMonth,
    handleNextMonth: handleNextMonth,
    handleDataChange: handleDataChange,
    setSelectedDate: setSelectedDate,
    selectedDate: selectedDate,
  };

  const actions = {
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    removeTransaction: removeTransaction,
    transfer: transfer,
  };

  const colorTypes = ["#9A4444", "#D6D46D", "#DE8F5F"];
  const data = financeState.generalStructure?.types?.map((type, idx) => {
    const subtotal = financeState.allTransactions
      .filter((tx) => tx.typeName === type.name)
      .reduce((acc, tx) => acc + tx.sum, 0);
    return {
      name: type.name,
      subtotal: subtotal,
      fill: colorTypes[idx],
    };
  });

  const toRender = financeState.generalStructure ? (
    isAuthenticated ? (
      <div className="AllTransactions">
        <Navbar />

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              index
              element={
                <MainPage
                  financeState={financeState}
                  updatePage={fetchData}
                  dataForChart={data}
                  actions={actions}
                  handleMonths={handleMonths}
                  theme={theme}
                />
              }
            />
            <Route
              path="expenses"
              element={
                <FinancialInfoPage
                  financeState={financeState}
                  dataForChart={data}
                  handleMonths={handleMonths}
                  typeName="Expenses"
                  theme={theme}
                />
              }
            />
            <Route
              path="incomes"
              element={
                <FinancialInfoPage
                  financeState={financeState}
                  handleMonths={handleMonths}
                  typeName="Incomes"
                  theme={theme}
                />
              }
            />
            <Route
              path="savings"
              element={
                <FinancialInfoPage
                  financeState={financeState}
                  handleMonths={handleMonths}
                  typeName="Savings"
                  theme={theme}
                />
              }
            />
            <Route
              path="wishes"
              element={
                <Wishes fulfillWish={addTransaction} transferMoney={transfer} />
              }
            />
            <Route
              path="logout"
              element={<Logout changeAuthStatus={setIsAuthenticated} />}
            />
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
      <Login changeAuthStatus={setIsAuthenticated} />
    )
  ) : (
    <div className="AllTransactions">
      <Navbar />
      {error.isError ? <ErrorPage error={error} /> : null}
    </div>
  );
  return toRender;
}
