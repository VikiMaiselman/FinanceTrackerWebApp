import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fab } from "@mui/material";
import "../../styles/Form.css";

export default function RemoveSubtypeForm({ types, actions }) {
  const [subtype, setSubtype] = useState({
    name: "",
  });
  const [type, setType] = useState("");

  const { removeSubtype } = actions;

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };
    setSubtype(updateTxState);
  };

  const handleChangeType = (event) => {
    const { value } = event.target;

    const typeChoosen = types.find((t) => t.name === value);
    setType(typeChoosen);
  };

  const handleFocus = (event) => {
    event.target.value = "";
  };

  const handleClick = (event) => {
    event.preventDefault();
    const subtypeObj = type?.subtypes?.find(
      (subt) => subt.name === subtype.name
    );
    removeSubtype(subtypeObj, type.name);
    setSubtype({
      name: "",
    });
  };

  return (
    <form className="SubtypeForm">
      <h3>
        Remove any of your <span className="span-underline">custom</span>{" "}
        categories:{" "}
      </h3>
      <h4>
        Remember, that all transactions associated with this category will also
        be lost!
      </h4>
      Your total financial state will be updated accordingly.
      <input
        name="typeName"
        value={subtype.typeName}
        list={`datalist-categs`}
        placeholder="Select the main category..."
        onChange={handleChangeType}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={`datalist-categs`}>
        <option value={"Incomes"} />
        <option value={"Expenses"} />
        <option value={"Savings"} />
      </datalist>
      <input
        name="name"
        value={subtype.name}
        list={`datalist-$categ`}
        placeholder="Select subcategory..."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      {type && (
        <datalist id={`datalist-$categ`}>
          {console.log(type)}
          {type.subtypes.map((subtype) => {
            return (
              <option key={subtype._id} id={subtype._id} value={subtype.name} />
            );
          })}
        </datalist>
      )}
      <Fab onClick={handleClick} size="small">
        <DeleteIcon sx={{ color: "#706233" }} />
      </Fab>
    </form>
  );
}
