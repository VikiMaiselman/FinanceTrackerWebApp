import React, { useState } from "react";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import "../../styles/Form.css";

export default function TransferForm({
  currentTransaction,
  transferToSavings,
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
    transferToSavings(currentTransaction, transfer.amountToTransfer);
    setShouldShowModal(false);
    setTransfer({
      amountToTransfer: "",
    });
  };

  return (
    <form className="Transaction TransactionForm">
      <input
        onChange={handleChange}
        name="amountToTransfer"
        value={transfer.amountToTransfer}
        placeholder={`You can transfer any sum less or equal to ${currentTransaction.sum}`}
      />

      <button onClick={handleClick}>
        <SyncAltIcon fontSize="small" />
        Transfer
      </button>
    </form>
  );
}
