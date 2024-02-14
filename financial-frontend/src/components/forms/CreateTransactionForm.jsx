import React, { useState } from "react";
import Swal from "sweetalert2";
import { Tooltip } from "@mui/material";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import "../../styles/Form.css";

import { FinanceContext } from "../../contexts/Finance.context";

export default function CreateTransactionForm({ type }) {
  const [tx, setTx] = useState({
    name: "",
    sum: "",
    subtypeName: "",
    typeName: type.name,
  });

  const { addTransaction } = React.useContext(FinanceContext);

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

    if (tx.sum < 0 || !tx.sum) {
      Swal.fire({
        title: "Ooops! The operation failed.",
        text: "You can't fill in a negative number or leave it empty.",
        icon: "warning",
        confirmButtonColor: "rgb(154, 68, 68)",
        iconColor: "rgb(154, 68, 68)",
      });
      setTx({
        name: "",
        sum: "",
        subtypeName: "",
        typeName: type.name,
      });
      return;
    }
    addTransaction(tx);
    setTx({
      name: "",
      sum: "",
      subtypeName: "",
      typeName: type.name,
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
        type="number"
        name="sum"
        value={tx.sum}
        placeholder="Sum..."
        autoComplete="off"
      />

      <input
        name="subtypeName"
        id="subtype"
        value={tx.subtypeName}
        list={`datalist-${type.name}`}
        placeholder="Select category..."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={`datalist-${type.name}`}>
        {type.subtypes.map((subtype) => {
          return <option key={subtype._id} value={subtype.name} />;
        })}
      </datalist>
      <div>
        <Tooltip title="Add">
          <button onClick={handleClick}>
            <AddCircleOutlineSharpIcon sx={{ color: "#706233" }} />
          </button>
        </Tooltip>
      </div>
    </form>
  );
}
