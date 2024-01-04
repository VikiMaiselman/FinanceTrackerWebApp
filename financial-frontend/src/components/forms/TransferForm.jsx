import React, { useState } from "react";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/Form.css";

const theme = createTheme({
  palette: {
    transfer: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function TransferForm({
  currentTransaction,
  transferAction,
  setShouldShowModal,
}) {
  const [transfer, setTransfer] = useState({
    amountToTransfer: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };

    setTransfer(updateTxState);
  };

  const handleClick = (event) => {
    event.preventDefault();
    transferAction(currentTransaction, transfer.amountToTransfer);
    setShouldShowModal(false);
    setTransfer({
      amountToTransfer: "",
    });
  };

  return (
    <form className="Transfer">
      <input
        onChange={handleChange}
        name="amountToTransfer"
        value={transfer.amountToTransfer}
        placeholder={`You can transfer any sum less or equal to: ${currentTransaction.sum}₪`}
      />

      <ThemeProvider theme={theme}>
        <Button onClick={handleClick} variant="contained" color="transfer">
          <SyncAltIcon fontSize="small" />
          Transfer
        </Button>
      </ThemeProvider>
    </form>
  );
}
