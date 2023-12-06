import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateTransactionForm from "./UpdateTransactionForm";
import "../styles/Transaction.css";

export default function Transaction({ txData, metadata }) {
  const { name, sum, date, subtypeName } = txData;
  const updateTransaction =
    metadata?.actionsWithTransactions?.updateTransaction;
  const removeTransaction =
    metadata?.actionsWithTransactions?.removeTransaction;

  const [isEditable, setIsEditable] = useState(false);

  const displayMore = metadata.actionsWithTransactions ? true : false;
  const whatToRender = isEditable ? (
    <UpdateTransactionForm
      txData={txData}
      metadata={metadata}
      setIsEditable={setIsEditable}
    />
  ) : (
    <div className={displayMore ? "Transaction" : "Transaction less-columns"}>
      <p className="name">{name}</p>
      <p>{sum} ₪</p>
      <p>{date}</p>
      {displayMore && <p>({subtypeName})</p>}
      {displayMore && (
        <div className="Transaction-data">
          <button
            className="Transaction-handlerBtn"
            onClick={(event) => {
              event.preventDefault();
              setIsEditable(true);
            }}
          >
            <EditIcon sx={{ color: "#706233" }} />
          </button>
          <button
            className="Transaction-handlerBtn"
            onClick={(event) => {
              event.preventDefault();
              removeTransaction?.(txData, metadata.globalId);
            }}
          >
            <DeleteIcon sx={{ color: "#706233" }} />
          </button>
        </div>
      )}
    </div>
  );

  return whatToRender;
}
