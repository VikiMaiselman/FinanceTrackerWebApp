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
import Wishes from "./Wishes";
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
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    fetchData();
  };

  const updateTransaction = async (transaction) => {
    const dataForBackend = {
      transaction: transaction,
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
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    fetchData();
  };

  const removeTransaction = async (transaction) => {
    const dataForBackend = {
      transaction: transaction,
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
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }
    fetchData();
  };

  const transfer = async (
    fromTransaction,
    amountForTransfer,
    isTransferToWish
  ) => {
    if (fromTransaction.sum < amountForTransfer) {
      Swal.fire({
        title: "Ooops!",
        text: "Not enough money, choose another sum to transfer.",
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }

    try {
      // update transaction of question - amount
      fromTransaction.sum = fromTransaction.sum - amountForTransfer;
      await updateTransaction(fromTransaction);

      if (!isTransferToWish) {
        const newTransaction = {
          name:
            fromTransaction.typeName === "Incomes"
              ? "Transfer from Incomes"
              : "Transfer from Savings",
          sum: amountForTransfer,
          subtypeName:
            fromTransaction.typeName === "Incomes"
              ? "General Savings"
              : "Other Incomes",
          typeName:
            fromTransaction.typeName === "Incomes" ? "Savings" : "Incomes",
        };
        await addTransaction(newTransaction);
      }

      // if all money wa transfered let the user decide if delete the original transaction
      if (
        fromTransaction.sum === 0 &&
        fromTransaction.subtypeName !== "Wishes Fund"
      ) {
        const result = await Swal.fire({
          title: "Want to delete original the transaction?",
          text: "There are no money left on it after money transfer",
          icon: "warning",
          iconColor: "#5f6f52",
          showCancelButton: true,
          confirmButtonColor: "#5f6f52",
          cancelButtonColor: "#FBF0DF",
          cancelButtonText: "<p style='color:black'>No</p>",
          confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed) {
          await removeTransaction(fromTransaction);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });
        }
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops! Could not transfer :(",
        text: error.response.data,
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }
  };

  const actions = {
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    removeTransaction: removeTransaction,
    transfer: transfer,
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
