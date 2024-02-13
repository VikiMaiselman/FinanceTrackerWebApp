import React from "react";
import useMonthState from "../hooks/useMonthState";

export const MonthContext = React.createContext();

export default function MonthProvider({ children }) {
  const [selectedDate, handleDataChange, handlePrevMonth, handleNextMonth] =
    useMonthState();

  console.log("context inititalized", selectedDate);

  const contextValue = React.useMemo(
    () => ({
      selectedDate,
      handleDataChange,
      handlePrevMonth,
      handleNextMonth,
    }),
    [selectedDate, handleDataChange, handlePrevMonth, handleNextMonth]
  );

  return (
    <MonthContext.Provider value={contextValue}>
      {children}
    </MonthContext.Provider>
  );
}
