import React from "react";
import { Grid, Button, Tooltip } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SwipeLeftIcon from "@mui/icons-material/SwipeLeft";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import TransactionsContainer from "./TransactionsContainer";
import CustomPieChart from "./CustomPieChart";
import "../styles/ManageSubtypes.css";
import { CustomThemeContext } from "../contexts/CustomTheme.context";
import { MonthContext } from "../contexts/Month.context";
import { FinanceContext } from "../contexts/Finance.context";

export default function FinancialInfoPage({ typeName }) {
  const { theme } = React.useContext(CustomThemeContext);

  const { selectedDate, handleDataChange, handlePrevMonth, handleNextMonth } =
    React.useContext(MonthContext);

  const { financeState } = React.useContext(FinanceContext);

  const type = financeState.generalStructure.types.find(
    (type) => type.name === typeName
  );
  const typeTransactions = financeState.allTransactions.filter(
    (tx) => tx.typeName === typeName
  );
  const totalSumThisMonth = typeTransactions.reduce(
    (acc, tx) => acc + tx.sum,
    0
  );
  const typeTotal = financeState.generalStructure.types.find(
    (type) => type.name === typeName
  ).typeTotal;

  const dataForChart = type.subtypes
    .map((subtype) => {
      const associatedTransactions = typeTransactions.filter(
        (tx) => tx.subtypeName === subtype.name
      );

      const sumForSubtype = associatedTransactions
        .flat()
        .reduce((acc, tx) => acc + tx.sum, 0);

      if (sumForSubtype === 0) return {};

      return {
        key: subtype._id,
        name: subtype.name,
        subtotal: sumForSubtype,
        fill: subtype.color,
      };
    })
    .filter((element) => {
      return element.key !== undefined;
    });

  return (
    <div className="AllTransactions">
      <h1 className="Header">
        <Tooltip
          sx={{ minWidth: "max-content" }}
          title={
            <h3>
              Total {typeName} (all months):{" "}
              {Math.sign(typeTotal) === -1 ? typeTotal * -1 : typeTotal}₪
            </h3>
          }
        >
          My {typeName}
        </Tooltip>
        : {totalSumThisMonth}₪{" "}
      </h1>
      <div>
        <div className="Main-month">
          <ThemeProvider theme={theme}>
            <Tooltip title="Previous month" placement="bottom">
              <Button
                onClick={handlePrevMonth}
                color="colors"
                sx={{ marginTop: "2.5%" }}
              >
                <SwipeLeftIcon />
              </Button>
            </Tooltip>
          </ThemeProvider>
          <h1>in {format(selectedDate, "MMMM yyyy")} </h1>
          <ThemeProvider theme={theme}>
            <Tooltip title="Next month" placement="bottom">
              <Button
                onClick={handleNextMonth}
                color="colors"
                sx={{ marginTop: "2.5%" }}
              >
                <SwipeRightIcon />
              </Button>
            </Tooltip>
          </ThemeProvider>
        </div>
        <DatePicker
          className="DatePicker"
          selected={selectedDate}
          onChange={handleDataChange}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
        />
      </div>

      {type.typeTotal !== 0 && <CustomPieChart data={dataForChart} />}

      <Grid container className="AllTransactions-contents" spacing={8}>
        {type.subtypes.map((subtype) => {
          const transactionsOfThisSubtype = typeTransactions.filter(
            (tx) => tx.subtypeName === subtype.name
          );

          const toReturn =
            transactionsOfThisSubtype.length === 0 ? (
              <div key={subtype._id}></div>
            ) : (
              <Grid
                className="AllTransaction-content"
                item
                theme={theme}
                lg={12}
                xl={4}
                key={subtype._id}
              >
                <TransactionsContainer
                  key={subtype._id}
                  isFullVersion={false}
                  transactionsToDisplay={transactionsOfThisSubtype}
                  type={subtype}
                />
              </Grid>
            );
          return toReturn;
        })}
      </Grid>
    </div>
  );
}
