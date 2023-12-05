import React from "react";
import Transaction from "./Transaction";
import CreateTransactionForm from "./CreateTransactionForm";
import "../styles/TransactionsContainer.css";

export default function TransactionsContainer({
  financialState,
  type,
  actionsWithTransactions,
}) {
  const transactionsPerType = financialState.allTransactions.filter(
    (tx) => tx.typeName === type.name
  );

  const metadataForNewTransaction = {
    globalId: financialState.generalStructure._id,
    actionsWithTransactions: actionsWithTransactions,
    type: type,
  };

  return (
    <div className="TransactionsContainer">
      <div className="Transaction data">
        <div className="Transaction-data">
          <p className="heading">Transaction</p>
          <p className="heading">Sum (in ₪)</p>
          <p className="heading">Date</p>
          <p className="heading">Category</p>
          <p className="heading">Actions</p>
        </div>
      </div>
      {transactionsPerType.map((tx) => {
        return (
          <Transaction
            key={tx._id}
            txData={tx}
            metadata={metadataForNewTransaction}
          />
        );
      })}
      <CreateTransactionForm metadata={metadataForNewTransaction} />
    </div>
  );
}
