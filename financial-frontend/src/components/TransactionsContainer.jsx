import React from "react";
import Transaction from "./Transaction";
import CreateTransactionForm from "./CreateTransactionForm";
import "../styles/TransactionsContainer.css";

export default function TransactionsContainer({
  globalId,
  transactionsToDisplay,
  type,
  actionsWithTransactions,
}) {
  const metadataForNewTransaction = {
    globalId: globalId,
    actionsWithTransactions: actionsWithTransactions,
    type: type,
  };
  const displayMore = actionsWithTransactions ? true : false;

  return (
    <div className="TransactionsContainer">
      <h2>My {type.name}:</h2>
      <div
        className={
            displayMore
            ? "Transaction data"
            : "Transaction data less-columns"
        }
      >
        <p className="heading">Transaction</p>
        <p className="heading">Sum (in ₪)</p>
        <p className="heading">Date</p>
        {displayMore && <p className="heading">Category</p>}
        {displayMore && <p className="heading">Actions</p>}
      </div>
      {transactionsToDisplay.map((tx) => {
        return (
          <Transaction
            key={tx._id}
            txData={tx}
            metadata={metadataForNewTransaction}
          />
        );
      })}
      {actionsWithTransactions && (
        <CreateTransactionForm metadata={metadataForNewTransaction} />
      )}
    </div>
  );
}
