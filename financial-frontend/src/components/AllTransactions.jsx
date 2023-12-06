import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { Grid, createTheme } from "@mui/material";
import axios from "axios";

import TransactionsContainer from "./TransactionsContainer";
import AllExpenses from "./AllExpenses";
import RadialChart from "./RadialChart";
import "../styles/AllTransactions.css";

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

export default function AllTransactions() {
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

      console.log(finance);
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
    }
    fetchData();
  };

  const actions = {
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    removeTransaction: removeTransaction,
  };

  const colorTypes = ["#9A4444", "#D6D46D", "#DE8F5F"];
  const dataForChart = {
    total: financeState.generalStructure?.total,
    subdata:
      financeState.generalStructure?.types?.map((type, idx) => {
        return {
          name: type.name,
          subtotal:
            ((type.typeTotal < 0 ? type.typeTotal * -1 : type.typeTotal) *
              100) /
            financeState.generalStructure?.total,
          fill: colorTypes[idx],
        };
      }) || [],
  };

  const toRender = financeState.generalStructure ? (
    <div className="AllTransactions">
      <h1>My Total Financial State: {financeState.generalStructure.total}₪</h1>
      <div className="MainChart">
        <RadialChart dataForChart={dataForChart} />
      </div>
      <Grid container className="AllTransactions-contents" spacing={8}>
        {financeState.generalStructure.types.map((type) => {
          const transactionsPerType = financeState.allTransactions.filter(
            (tx) => tx.typeName === type.name
          );
          return (
            <Grid
              className="AllTransaction-content"
              item
              theme={theme}
              lg={12}
              xl={4}
            >
              <TransactionsContainer
                key={type._id}
                transactionsToDisplay={transactionsPerType}
                globalId={financeState.generalStructure._id}
                // financialState={financeState}
                type={type}
                actionsWithTransactions={actions}
              />
            </Grid>
          );
        })}
      </Grid>
      <AllExpenses financialState={financeState} />
    </div>
  ) : (
    <></>
  );
  return toRender;
}
