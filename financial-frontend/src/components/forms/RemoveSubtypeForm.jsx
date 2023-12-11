import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Fab } from "@mui/material";
import "../../styles/Form.css";

export default function RemoveSubtypeForm({ type, actions }) {
  const [subtype, setSubtype] = useState({
    name: "",
  });

  const { removeSubtype } = actions;

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateTxState = (prevState) => {
      return { ...prevState, [name]: value };
    };

    setSubtype(updateTxState);
  };

  const handleFocus = (event) => {
    event.target.value = "";
  };

  const handleClick = (event) => {
    event.preventDefault();
    const subtypeObj = type.subtypes.find((subt) => subt.name === subtype.name);
    removeSubtype(subtypeObj);
    setSubtype({
      name: "",
    });
  };

  return (
    <form className="SubtypeForm">
      <h3>
        Remove any of your <span className="span-underline">custom</span>{" "}
        {type.name[0].toLowerCase() + type.name.slice(1)} subcategories:{" "}
      </h3>
      <h4>
        Remember, that all transactions associated with this subcategory will
        also be lost!
      </h4>
      Your total financial state will also be updated accordingly.
      <input
        name="name"
        value={subtype.name}
        list={`datalist-${type.name}`}
        placeholder="Select subcategory..."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={`datalist-${type.name}`}>
        {type.subtypes.map((subtype) => {
          return (
            <option key={subtype._id} id={subtype._id} value={subtype.name} />
          );
        })}
      </datalist>
      <Fab onClick={handleClick} size="small">
        <DeleteIcon sx={{ color: "#706233" }} />
      </Fab>
    </form>
  );
}
