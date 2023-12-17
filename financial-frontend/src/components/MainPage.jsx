import React from "react";
import { Grid } from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";

import CustomBarChart from "./CustomBarChart";
import TransactionsContainer from "./TransactionsContainer";
import CreateSubtypeForm from "./forms/CreateSubtypeForm";
import RemoveSubtypeForm from "./forms/RemoveSubtypeForm";
import "../styles/AllTransactions.css";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function MainPage({
  financeState,
  dataForChart,
  actions,
  theme,
  updatePage,
}) {
  const addSubtype = async (newSubtype) => {
    const dataForBackend = {
      newSubtype: newSubtype,
      globalId: financeState.generalStructure._id,
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
      });
    }

    await updatePage();
  };

  const removeSubtype = async (subtype, typeName) => {
    console.log(subtype);
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
      });
    }

    await updatePage();
  };

  const actionsWithCats = {
    addSubtype: addSubtype,
    removeSubtype: removeSubtype,
  };

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

      <div>
        <h2 className="ManageSubtypes-h2">
          Here you can manage your subcategories for a better finance analytics
          and planification:
        </h2>
        <div className="ManageSubtypes">
          <CreateSubtypeForm actions={actionsWithCats} />
          <RemoveSubtypeForm
            types={financeState.generalStructure.types}
            actions={actionsWithCats}
          />
        </div>
      </div>
    </div>
  );
}
