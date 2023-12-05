import React, { useState } from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "../styles/CreateTransactionForm.css";

export default function CreateTransactionForm({ metadata }) {
  const [tx, setTx] = useState({
    name: "",
    sum: "",
    globalId: metadata.globalId,
    subtypeName: "",
    typeName: metadata.type.name,
  });

  const { addTransaction } = metadata.actionsWithTransactions;

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
    addTransaction(tx);
    setTx({
      name: "",
      sum: "",
      globalId: metadata.globalId,
      subtypeName: "",
      typeName: metadata.type.name,
    });
  };

  return (
    <form className="Transaction CreateTransactionForm">
      <input
        onChange={handleChange}
        name="name"
        value={tx.name}
        placeholder="Transaction..."
      />
      <input
        onChange={handleChange}
        name="sum"
        value={tx.sum}
        placeholder="Sum..."
      />

      <input
        name="subtypeName"
        id="subtype"
        value={tx.subtypeName}
        list={metadata.type.subtypes}
        placeholder="Select category..."
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
      <div>
        <button onClick={handleClick}>
          <AddCircleOutlineSharpIcon sx={{ color: "#706233" }} />
        </button>
      </div>
    </form>
  );
}
