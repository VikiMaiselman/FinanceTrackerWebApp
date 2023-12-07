import React from "react";
import { Grid, createTheme } from "@mui/material";
import TransactionsContainer from "./TransactionsContainer";
import CustomPieChart from "./CustomPieChart";

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
    // total: expensesGeneral.typeTotal !== 0 ? expensesGeneral.typeTotal * (-1) : 0,
    subdata:
      expensesGeneral.subtypes.map((subtype, idx) => {
        const associatedTx = expensesTransactions.filter(
          (tx) => tx.subtypeName === subtype.name
        );
        const sumForSubtype = associatedTx
          .flat()
          .reduce((acc, tx) => acc + tx.sum, 0);
        console.log(associatedTx, sumForSubtype, "associatedTx");

        if (sumForSubtype === 0) return {};
        return {
          key: subtype._id,
          name: subtype.name,
          subtotal: sumForSubtype,
          fill: subtype.color,
        };
      }) || [],
  };

  return (
    <div className="AllTransactions">
      <h1>My Total Expenses: {expensesGeneral.typeTotal * -1}₪</h1>

      <div className="MainChart">
        <CustomPieChart data={dataForChart.subdata} />
      </div>

      <Grid container className="AllTransactions-contents" spacing={8}>
        {expensesGeneral.subtypes.map((subtype) => {
          const transactionsOfThisSubtype = expensesTransactions.filter(
            (tx) => tx.subtypeName === subtype.name
          );

          const toReturn =
            transactionsOfThisSubtype.length === 0 ? (
              <></>
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
                  transactionsToDisplay={transactionsOfThisSubtype}
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
