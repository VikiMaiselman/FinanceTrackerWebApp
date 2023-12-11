import React from "react";
import { Grid } from "@mui/material";

import CustomBarChart from "./CustomBarChart";
import TransactionsContainer from "./TransactionsContainer";
import "../styles/AllTransactions.css";

export default function MainPage({
  financeState,
  dataForChart,
  actions,
  theme,
}) {
  return (
    <div className="AllTransactions">
      <h1>My Total Financial State: {financeState.generalStructure.total}₪</h1>

      {financeState.generalStructure.total !== 0 && (
        <CustomBarChart data={dataForChart} />
      )}

      <Grid container className="AllTransactions-contents" spacing={8}>
        {financeState.generalStructure.types.map((type) => {
          const transactionsOfThisType = financeState.allTransactions.filter(
            (tx) => tx.typeName === type.name
          );
          return (
            <Grid
              className="AllTransaction-content"
              item
              theme={theme}
              lg={12}
              xl={4}
              key={type._id}
            >
              <TransactionsContainer
                key={type._id}
                isFullVersion={true}
                transactionsToDisplay={transactionsOfThisType}
                globalId={financeState.generalStructure._id}
                type={type}
                actions={actions}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
