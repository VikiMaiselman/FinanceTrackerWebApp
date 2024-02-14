import React from "react";
import Transaction from "./Transaction";
import CreateTransactionForm from "./forms/CreateTransactionForm";
import "../styles/TransactionsContainer.css";

export default function TransactionsContainer({
  isFullVersion,
  transactionsToDisplay,
  type,
  setShouldShowModal,
  setTransferTx,
}) {
  return (
    <div className="TransactionsContainer">
      <h2>My {type.name}:</h2>
      <div
        className={
          isFullVersion ? "Transaction data" : "Transaction data less-columns"
        }
      >
        <p className="heading">Transaction</p>
        <p className="heading">Sum (in ₪)</p>
        <p className="heading">Date</p>
        {isFullVersion && <p className="heading">Category</p>}
        {isFullVersion && <p className="heading">Actions</p>}
      </div>
      {transactionsToDisplay.map((tx) => {
        return (
          <Transaction
            key={tx._id}
            isFullVersion={isFullVersion}
            txData={tx}
            type={type}
            setShouldShowModal={setShouldShowModal}
            setTransferTx={setTransferTx}
          />
        );
      })}
      {isFullVersion && <CreateTransactionForm type={type} />}
    </div>
  );
}
