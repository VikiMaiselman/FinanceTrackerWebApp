import React, { useEffect } from "react";
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
import { addMonths } from "date-fns";

import useFinanceState from "../hooks/useFinanceState";

export default function AppRouter() {
  const auth = React.useContext(AuthContext);

  const {
    financeState,
    fetchData,
    addTransaction,
    error,
    selectedDate,
    setSelectedDate,
  } = useFinanceState();

  console.log("reloading");

  const handleDataChange = (date) => {
    setSelectedDate(date);
  };
  const handlePrevMonth = async () => {
    setSelectedDate(addMonths(selectedDate, -1));
  };
  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  // useEffect(() => {
  //   fetchData();
  // }, [selectedDate, financeState]);

  const handleMonths = {
    handlePrevMonth: handlePrevMonth,
    handleNextMonth: handleNextMonth,
    handleDataChange: handleDataChange,
    setSelectedDate: setSelectedDate,
    selectedDate: selectedDate,
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
    auth.isAuthenticated ? (
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
                  // actions={actions}
                  handleMonths={handleMonths}
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
                />
              }
            />
            <Route
              path="wishes"
              element={<Wishes fulfillWish={addTransaction} />}
            />
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
