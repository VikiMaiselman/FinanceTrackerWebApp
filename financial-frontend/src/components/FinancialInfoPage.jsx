import React from "react";
import { Grid } from "@mui/material";
import axios from "axios";

import CreateSubtypeForm from "./forms/CreateSubtypeForm";
import RemoveSubtypeForm from "./forms/RemoveSubtypeForm";
import TransactionsContainer from "./TransactionsContainer";
import CustomPieChart from "./CustomPieChart";
import "../styles/ManageSubtypes.css";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function FinancialInfoPage({
  financeState,
  updatePage,
  typeName,
  theme,
  errorHandler,
}) {
  const typeGeneral = financeState.generalStructure.types.find(
    (type) => type.name === typeName
  );
  const typeTransactions = financeState.allTransactions.filter(
    (tx) => tx.typeName === typeName
  );

  const addSubtype = async (newSubtype) => {
    const dataForBackend = {
      newSubtype: newSubtype,
      globalId: financeState.generalStructure._id,
      typeName: typeName,
    };
    try {
      await axios.post(
        `${url}/addSubtype`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      console.error(error);
      errorHandler({
        isError: true,
        message: error.response.data,
      });
    }

    await updatePage();
  };

  const removeSubtype = async (subtype) => {
    const dataForBackend = {
      subtype: subtype,
      globalId: financeState.generalStructure._id,
      typeName: typeName,
    };

    try {
      await axios.post(
        `${url}/removeSubtype`,
        dataForBackend,
        { withCredentials: true },
        headers
      );
    } catch (error) {
      console.error(error);
      errorHandler({
        isError: true,
        message: error.response.data,
      });
    }

    await updatePage();
  };

  const actions = {
    addSubtype: addSubtype,
    removeSubtype: removeSubtype,
  };

  const dataForChart = typeGeneral.subtypes
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
      <h1>
        My Total {typeName}:{" "}
        {typeName === "Expenses"
          ? typeGeneral.typeTotal * -1
          : typeGeneral.typeTotal}
        ₪
      </h1>

      {typeGeneral.typeTotal !== 0 && <CustomPieChart data={dataForChart} />}

      <Grid container className="AllTransactions-contents" spacing={8}>
        {typeGeneral.subtypes.map((subtype) => {
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
                  actions={actions}
                />
              </Grid>
            );
          return toReturn;
        })}
      </Grid>

      <div>
        <h2 className="ManageSubtypes-h2">
          Here you can manage your subcategories for a better finance analytics
          and planification:
        </h2>
        <div className="ManageSubtypes">
          <CreateSubtypeForm type={typeGeneral} actions={actions} />
          <RemoveSubtypeForm type={typeGeneral} actions={actions} />
        </div>
      </div>
    </div>
  );
}
