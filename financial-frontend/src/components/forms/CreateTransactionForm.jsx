import React, { useState } from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "../../styles/Form.css";

export default function CreateTransactionForm({ metadata }) {
  const [tx, setTx] = useState({
    name: "",
    sum: "",
    globalId: metadata.globalId,
    subtypeName: "",
    typeName: metadata.type.name,
  });

  const { addTransaction } = metadata.actions;

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
    <form className="Transaction TransactionForm">
      <input
        onChange={handleChange}
        name="name"
        value={tx.name}
        placeholder="Transaction..."
        autoComplete="off"
      />
      <input
        onChange={handleChange}
        name="sum"
        value={tx.sum}
        placeholder="Sum..."
        autoComplete="off"
      />

      <input
        name="subtypeName"
        id="subtype"
        value={tx.subtypeName}
        list={`datalist-${metadata.type.name}`}
        placeholder="Select category..."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={`datalist-${metadata.type.name}`}>
        {metadata.type.subtypes.map((subtype) => {
          return <option key={subtype._id} value={subtype.name} />;
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
