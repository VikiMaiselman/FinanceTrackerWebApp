import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateTransactionForm from "./UpdateTransactionForm";
import "../styles/Transaction.css";

export default function Transaction({ txData, metadata }) {
  const { name, sum, date, subtypeName } = txData;
  const { updateTransaction, removeTransaction } =
    metadata.actionsWithTransactions;

  const [isEditable, setIsEditable] = useState(false);

  const whatToRender = isEditable ? (
    <UpdateTransactionForm
      txData={txData}
      metadata={metadata}
      setIsEditable={setIsEditable}
    />
  ) : (
    <div className="Transaction">
      <div className="Transaction-data">
        <p className="name">{name}</p>
        <p>{sum} ₪</p>
        <p>{date}</p>
        <p>({subtypeName})</p>
      </div>
      <div className="Transaction-data">
        <button
          className="Transaction-handlerBtn"
          onClick={(event) => {
            setIsEditable(true);
            updateTransaction(event);
          }}
        >
          <EditIcon sx={{ color: "#706233" }} />
        </button>
        <button
          className="Transaction-handlerBtn"
          onClick={(event) => {
            removeTransaction(txData, metadata.globalId);
          }}
        >
          <DeleteIcon sx={{ color: "#706233" }} />
        </button>
      </div>
    </div>
  );

  return whatToRender;
}
