import React from "react";
import { Grid } from "@mui/material";

import TransactionsContainer from "./TransactionsContainer";
import CustomPieChart from "./CustomPieChart";
import "../styles/ManageSubtypes.css";

export default function FinancialInfoPage({ financeState, typeName, theme }) {
  const type = financeState.generalStructure.types.find(
    (type) => type.name === typeName
  );
  const typeTransactions = financeState.allTransactions.filter(
    (tx) => tx.typeName === typeName
  );
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
        My Total {typeName}:{" "}
        {typeName === "Expenses" ? type.typeTotal * -1 : type.typeTotal}₪
      </h1>

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
                  globalId={financeState.generalStructure._id}
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
