import React, { useState } from "react";

export default function UpdateTransactionForm({
  txData,
  metadata,
  setIsEditable,
}) {
  console.log("in update transaction form", txData, metadata);
  const [tx, setTx] = useState({
    _id: txData._id,
    name: txData.name,
    sum: txData.sum,
    globalId: metadata.globalId,
    subtypeName: txData.subtypeName,
    typeName: metadata.type.name,
  });

  const { updateTransaction } = metadata.actionsWithTransactions;

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "subtypeName") event.target.blur();

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };

    setTx(updateTxState);
  };

  const handleFocus = (event) => {
    event.target.value = "";
  };

  const handleClick = (event) => {
    event.preventDefault();
    updateTransaction(tx, metadata.globalId);
    setIsEditable(false);
  };

  return (
    <form>
      <input onChange={handleChange} name="name" value={tx.name} />
      <input onChange={handleChange} name="sum" value={tx.sum} />

      <input
        name="subtypeName"
        value={tx.subtypeName}
        list={metadata.type.subtypes}
        placeholder="Select an option.."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={metadata.type.subtypes}>
        {metadata.type.subtypes.map((subtype) => {
          return (
            <option key={subtype.name} id={subtype.name} value={subtype.name} />
          );
        })}
      </datalist>

      <button onClick={handleClick}>Save</button>
    </form>
  );
}
