import React from "react";

import { addMonths } from "date-fns";

import { getCurrentDate } from "../helpers";

export default function useMonthState() {
  console.log("inititalized");
  const [selectedDate, setSelectedDate] = React.useState(() =>
    getCurrentDate()
  );

  const handleDataChange = (date) => {
    setSelectedDate(date);
  };
  const handlePrevMonth = () => {
    setSelectedDate(addMonths(selectedDate, -1));
  };
  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  return [selectedDate, handleDataChange, handlePrevMonth, handleNextMonth];
}
