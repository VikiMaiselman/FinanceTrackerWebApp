import React from "react";
import useFinanceState from "../hooks/useFinanceState";

export const FinanceContext = React.createContext();

export default function FinanceProvider({ children }) {
  const [
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
  ] = useFinanceState();

  return (
    <FinanceContext.Provider
      value={{
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
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
