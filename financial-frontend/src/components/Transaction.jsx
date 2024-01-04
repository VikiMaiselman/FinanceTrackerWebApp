import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateTransactionForm from "./forms/UpdateTransactionForm";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import "../styles/Transaction.css";

export default function Transaction({
  isFullVersion,
  txData,
  metadata,
  setShouldShowModal,
  setTransactionDealtWith,
}) {
  const { name, sum, date, subtypeName } = txData;
  const removeTransaction = metadata?.actions?.removeTransaction;

  const [isEditable, setIsEditable] = useState(false);

  const whatToRender = isEditable ? (
    <UpdateTransactionForm
      txData={txData}
      metadata={metadata}
      setIsEditable={setIsEditable}
    />
  ) : (
    <div className={isFullVersion ? "Transaction" : "Transaction less-columns"}>
      <p className="name">{name}</p>
      <p>{sum} ₪</p>
      <p>{date}</p>
      {isFullVersion && <p>({subtypeName})</p>}
      {isFullVersion && (
        <div className="Transaction-data">
          {isFullVersion &&
          (metadata.type.name === "Incomes" ||
            metadata.type.name === "Savings") ? (
            <Tooltip title="Transfer">
              <button
                className="Transaction-handlerBtn"
                onClick={(event) => {
                  event.preventDefault();
                  setShouldShowModal(true);
                  setTransactionDealtWith(txData);
                }}
              >
                <SyncAltIcon sx={{ color: "#706233" }} />
              </button>
            </Tooltip>
          ) : null}
          <Tooltip title="Edit">
            <button
              className="Transaction-handlerBtn"
              onClick={(event) => {
                event.preventDefault();
                setIsEditable(true);
              }}
            >
              <EditIcon sx={{ color: "#706233" }} />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="Transaction-handlerBtn"
              onClick={(event) => {
                event.preventDefault();
                removeTransaction?.(txData);
              }}
            >
              <DeleteIcon sx={{ color: "#706233" }} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );

  return whatToRender;
}
