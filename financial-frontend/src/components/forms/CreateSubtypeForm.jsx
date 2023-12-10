import React, { useEffect, useState } from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { HexColorPicker } from "react-colorful";

import "../../styles/TransactionForm.css";

export default function CreateSubtypeForm({ type, actions }) {
  const [color, setColor] = useState("");
  const [subtypeName, setsubtypeName] = useState("");

  const { addSubtype } = actions;

  const handleChange = (event) => {
    const { value } = event.target;
    setsubtypeName(value);
  };

  const handleClick = (event) => {
    event.preventDefault();

    const subtype = {
      name: subtypeName,
      color: color,
    };

    addSubtype(subtype);
    setsubtypeName("");
  };

  return (
    <form className="Subtype">
      <h3>
        Create new {type.name[0].toLowerCase() + type.name.slice(1)}{" "}
        subcategory:{" "}
      </h3>

      <input
        onChange={handleChange}
        name="subtypeName"
        value={subtypeName}
        placeholder="Name of subcategory..."
      />

      <HexColorPicker color={color} onChange={setColor} />
      <p>Current color is {color}</p>

      <button onClick={handleClick}>
        <AddCircleOutlineSharpIcon sx={{ color: "#706233" }} />
      </button>
    </form>
  );
}
