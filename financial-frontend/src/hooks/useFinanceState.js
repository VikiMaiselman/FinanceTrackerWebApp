import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { url, headers, findTransactionsOfAMonth } from "../helpers";
import { MonthContext } from "../contexts/Month.context";
import { AuthContext } from "../contexts/Auth.context";

export default function useFinanceState() {
  const [financeState, setFinanceState] = useState({
    allTransactions: "",
    generalStructure: "",
  });
  const [error, errorHandler] = useState({
    isError: false,
    message: "",
  });

  const { selectedDate } = useContext(MonthContext);
  const auth = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const response = await axios.get(url, { withCredentials: true }, headers);
      const finance = response.data;

      const transactionsOfThisMonth = findTransactionsOfAMonth(
        finance,
        selectedDate
      );

      const newFinancialState = {
        allTransactions: transactionsOfThisMonth,
        generalStructure: finance.generalStructure,
      };

      setFinanceState((prevState) => {
        return {
          ...prevState,
          ...newFinancialState,
        };
      });
    } catch (error) {
      console.error(error);
      errorHandler({
        isError: true,
        message: error.response.data,
      });
    }
  };

  useEffect(() => {
    (async () => await fetchData())();
  }, [selectedDate, auth.isAuthenticated]);

  const addTransaction = async (newTransaction) => {
    try {
      await axios.post(url, newTransaction, { withCredentials: true }, headers);
      await fetchData();
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
      await fetchData();
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

    // getFinanceState();
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
      await fetchData();
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
          title: "Want to delete the original transaction?",
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

  const addSubtype = async (newSubtype) => {
    if (!newSubtype.name || !newSubtype.color || !newSubtype.typeName) {
      Swal.fire({
        title: "Ooops!",
        text: "Fill in all the fields, please.",
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }
    const dataForBackend = {
      newSubtype: newSubtype,
      typeName: newSubtype.typeName,
    };

    try {
      await axios.post(
        `${url}/addSubtype`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
      Swal.fire({
        title: "Success!",
        text: "Category added successfully",
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
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

    await fetchData();
  };

  const removeSubtype = async (subtype, typeName) => {
    if (!subtype || !typeName) {
      Swal.fire({
        title: "Ooops!",
        text: "Fill in all the fields, please.",
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }

    const dataForBackend = {
      subtype: subtype,
      typeName: typeName,
    };

    try {
      await axios.post(
        `${url}/removeSubtype`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
      Swal.fire({
        title: "Success!",
        text: "Category removed successfully",
        icon: "success",
        confirmButtonColor: "#5f6f52",
        iconColor: "#5f6f52",
      });
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

    await fetchData();
  };

  return [
    financeState,
    fetchData,
    addTransaction,
    updateTransaction,
    removeTransaction,
    transfer,
    addSubtype,
    removeSubtype,
    error,
    errorHandler,
  ];
}
