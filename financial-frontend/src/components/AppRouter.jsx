import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material";
import axios from "axios";

import Navbar from "./Navbar";
import FinancialInfoPage from "./FinancialInfoPage";
import MainPage from "./MainPage";
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

export default function AllTransactions({ errorHandler }) {
  const [financeState, setFinanceState] = useState({
    allTransactions: "",
    generalStructure: "",
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
    fetchData();
  }, []);

  const addTransaction = async (newTransaction) => {
    try {
      await axios.post(url, newTransaction, { withCredentials: true }, headers);
    } catch (error) {
      console.error(error);
      errorHandler({
        isError: true,
        message: error.response.data,
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
      errorHandler({
        isError: true,
        message: error.response.data,
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
      errorHandler({
        isError: true,
        message: error.response.data,
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

  const toRender = financeState.generalStructure ? (
    <div className="AllTransactions">
      <Navbar />

      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                financeState={financeState}
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
                updatePage={fetchData}
                typeName="Expenses"
                theme={theme}
                errorHandler={errorHandler}
              />
            }
          />
          <Route
            path="incomes"
            element={
              <FinancialInfoPage
                financeState={financeState}
                updatePage={fetchData}
                typeName="Incomes"
                theme={theme}
                errorHandler={errorHandler}
              />
            }
          />
          <Route
            path="savings"
            element={
              <FinancialInfoPage
                financeState={financeState}
                updatePage={fetchData}
                typeName="Savings"
                theme={theme}
                errorHandler={errorHandler}
              />
            }
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
    // </>
    <></>
  );
  return toRender;
}