import React from "react";
import { Grid, createTheme } from "@mui/material";
import TransactionsContainer from "./TransactionsContainer";

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

export default function AllExpenses({ financialState }) {
  const expensesGeneral = financialState.generalStructure.types.find(
    (type) => type.name === "Expenses"
  );
  //   console.log("AT", financialState.allTransactions, expensesGeneral);
  const expensesTransactions = financialState.allTransactions.filter(
    (tx) => tx.typeName === "Expenses"
  );

  const addTransaction = () => {};
  const updateTransaction = () => {};
  const removeTransaction = () => {};
  const actions = {
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    removeTransaction: removeTransaction,
  };

  const dataForChart = {
    total: expensesGeneral.typeTotal,
    subdata:
      expensesGeneral.subtypes.map((subtype, idx) => {
        return {
          name: subtype.name,
        //   subtotal:
        //     ((type.typeTotal < 0 ? type.typeTotal * -1 : type.typeTotal) *
        //       100) /
        //     financeState.generalStructure?.total,
        //   fill: colorTypes[idx],
        };
      }) || [],
  };

  return (
    <div className="AllTransactions">
      <h1>My Total Expenses: {expensesGeneral.typeTotal * -1}₪</h1>
      {/* <div className="MainChart">
        <RadialChart dataForChart={dataForChart} />
      </div> */}
      <Grid container className="AllTransactions-contents" spacing={8}>
        {expensesGeneral.subtypes.map((subtype) => {
          const subtypeTransactions = expensesTransactions.filter(
            (tx) => tx.subtypeName === subtype.name
          );

          const toReturn =
            subtypeTransactions.length === 0 ? (
              <></>
            ) : (
              <Grid
                className="AllTransaction-content"
                item
                theme={theme}
                lg={12}
                xl={4}
              >
                <TransactionsContainer
                  key={subtype._id}
                  transactionsToDisplay={subtypeTransactions}
                  globalId={financialState.generalStructure._id}
                  type={subtype}
                  // actionsWithTransactions={actions}
                />
              </Grid>
            );
          return toReturn;
        })}
      </Grid>
    </div>
  );
}

/* { txData, metadata }) {
  const { name, sum, date, subtypeName } = txData;
  const { updateTransaction, removeTransaction } =
    metadata?.actionsWithTransactions;*/
