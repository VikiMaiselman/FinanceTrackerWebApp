import React, { useState } from "react";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/Form.css";
import { CustomThemeContext } from "../../contexts/CustomTheme.context";
import useFinanceState from "../../hooks/useFinanceState";

export default function TransferForm({
  currentTransaction,
  setShouldShowModal,
}) {
  const { theme } = React.useContext(CustomThemeContext);
  const {transfer : transferAction} = useFinanceState();

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
