import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Grid, Button, Tooltip } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SwipeLeftIcon from "@mui/icons-material/SwipeLeft";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";

import CustomBarChart from "./CustomBarChart";
import TransactionsContainer from "./TransactionsContainer";
import CreateSubtypeForm from "./forms/CreateSubtypeForm";
import RemoveSubtypeForm from "./forms/RemoveSubtypeForm";
import Modal from "./Modal";
import TransferForm from "./forms/TransferForm";
import "../styles/AllTransactions.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

const themeMonths = createTheme({
  palette: {
    colors: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function MainPage({
  financeState,
  dataForChart,
  actions,
  handleMonths,
  theme,
  updatePage,
}) {
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [transactionOfTransfer, setTransactionDealtWith] = useState({});

  const addSubtype = async (newSubtype) => {
    if (!newSubtype.name || !newSubtype.color || !newSubtype.typeName) {
      Swal.fire({
        title: "Ooops!",
        text: "Fill in all the fields, please.",
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }
    const dataForBackend = {
      newSubtype: newSubtype,
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
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
    }

    await updatePage();
  };

  const removeSubtype = async (subtype, typeName) => {
    if (!subtype || !typeName) {
      Swal.fire({
        title: "Ooops!",
        text: "Fill in all the fields, please.",
        icon: "error",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      return;
    }

    const dataForBackend = {
      subtype: subtype,
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
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
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
      <h1 className="Header">
        My Total Financial State: {financeState.generalStructure.total}₪
      </h1>

      {financeState.generalStructure.total !== 0 && (
        <CustomBarChart data={dataForChart} />
      )}

      <div>
        <h1 style={{ fontWeight: "lighter" }}>My transactions as of: </h1>
        <div className="Main-month">
          <ThemeProvider theme={themeMonths}>
            <Tooltip title="Previous month" placement="bottom">
              <Button
                onClick={handleMonths.handlePrevMonth}
                color="colors"
                sx={{ marginTop: "2.5%" }}
              >
                <SwipeLeftIcon />
              </Button>
            </Tooltip>
          </ThemeProvider>
          <h1>{format(handleMonths.selectedDate, "MMMM yyyy")} </h1>
          <ThemeProvider theme={themeMonths}>
            <Tooltip title="Next month" placement="bottom">
              <Button
                onClick={handleMonths.handleNextMonth}
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
          selected={handleMonths.selectedDate}
          onChange={handleMonths.handleChange2}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
        />
      </div>

      {/* Transactions themselves:  */}
      <Grid
        container
        className="AllTransactions-contents"
        spacing={8}
        sx={{ marginTop: "-112px" }}
      >
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
                type={type}
                actions={actions}
                setShouldShowModal={setShouldShowModal}
                setTransactionDealtWith={setTransactionDealtWith}
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
      <Modal
        shouldShowModal={shouldShowModal}
        setShouldShowModal={setShouldShowModal}
      >
        <h2>You can transfer some money to your savings</h2>
        <p>
          "Do not save what is left after spending, but spend what is left after
          saving." W.Baffet
        </p>
        <TransferForm
          transferAction={actions.transfer}
          currentTransaction={transactionOfTransfer}
          setShouldShowModal={setShouldShowModal}
        />
      </Modal>
    </div>
  );
}
