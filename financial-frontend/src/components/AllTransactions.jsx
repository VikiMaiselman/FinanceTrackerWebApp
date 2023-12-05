import React, { useState, useEffect } from "react";
import axios from "axios";

import TransactionsContainer from "./TransactionsContainer";
import "../styles/AllTransactions.css";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

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
    // console.log("newTransaction", newTransaction);
    try {
      await axios.post(url, newTransaction, { withCredentials: true }, headers);
    } catch (error) {
      console.error(error);
    }

    fetchData();
  };

  const updateTransaction = async (transaction, globalId) => {
    console.log("in Update ", transaction, globalId);

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
    console.log("in Remove ", transaction, globalId);

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

  const toRender = financeState.generalStructure ? (
    <div className="AllTransactions">
      <h1>My Total Financial State: {financeState.generalStructure.total}₪</h1>

      <div className="AllTransactions-contents">
        {financeState.generalStructure.types.map((type) => {
          return (
            <TransactionsContainer
              key={type._id}
              financialState={financeState}
              type={type}
              actionsWithTransactions={actions}
            />
          );
        })}
      </div>
    </div>
  ) : (
    <></>
  );
  return toRender;
}
