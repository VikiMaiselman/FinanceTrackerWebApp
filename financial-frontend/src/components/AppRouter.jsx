import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { createTheme } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

import Navbar from "./Navbar";
import FinancialInfoPage from "./FinancialInfoPage";
import MainPage from "./MainPage";
import Logout from "./Logout";
import Login from "./forms/Login";
import ErrorPage from "./ErrorPage";
import "../styles/AllTransactions.css";
import "../styles/NavigationBar.css";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

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

  const [financeState, setFinanceState] = useState({
    allTransactions: "",
    generalStructure: "",
  });

  const [error, errorHandler] = useState({
    isError: false,
    message: "",
  });

  const getFinanceState = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true }, headers);
      const finance = response.data;
      const generalStructure = finance.generalStructure;
      const allTransactions = finance.allTransactions;

      const updateFinanceState = (prevState) => {
        return {
          ...prevState,
          allTransactions: allTransactions,
          generalStructure: generalStructure,
        };
      };
      setFinanceState(() => updateFinanceState());
    } catch (error) {
      console.error(error);
      errorHandler({
        isError: true,
        message: error.response.data,
      });
    }
  };

  async function fetchData() {
    await getFinanceState();
  }

  useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${url}/authstatus`,
          { withCredentials: true },
          headers
        );
        console.log("called backend to know if authenticated", response.data);
        setIsAuthenticated(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAuthStatus();

    fetchData();
  }, [isAuthenticated]);

  const addTransaction = async (newTransaction) => {
    try {
      await axios.post(url, newTransaction, { withCredentials: true }, headers);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops!",
        text: error.response.data,
        icon: "error",
      });
    }

    fetchData();
  };

  const updateTransaction = async (transaction, globalId) => {
    const dataForBackend = {
      transaction: transaction,
      globalId: globalId,
    };
    try {
      await axios.post(
        `${url}/updateTransaction`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops!",
        text: error.response.data,
        icon: "error",
      });
    }

    fetchData();
  };

  const removeTransaction = async (transaction, globalId) => {
    const dataForBackend = {
      transaction: transaction,
      globalId: globalId,
    };
    try {
      await axios.post(
        `${url}/deleteTransaction`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops!",
        text: error.response.data,
        icon: "error",
      });
    }
    fetchData();
  };

  const actions = {
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    removeTransaction: removeTransaction,
  };

  const colorTypes = ["#9A4444", "#D6D46D", "#DE8F5F"];
  const data = financeState.generalStructure?.types?.map((type, idx) => {
    return {
      name: type.name,
      subtotal: type.typeTotal < 0 ? type.typeTotal * -1 : type.typeTotal,
      fill: colorTypes[idx],
    };
  });

  console.log("is auth? ", isAuthenticated);

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
                  theme={theme}
                />
              }
            />
            <Route
              path="expenses"
              element={
                <FinancialInfoPage
                  financeState={financeState}
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
                  typeName="Savings"
                  theme={theme}
                />
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
