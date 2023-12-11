import React, { useState } from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { Fab } from "@mui/material";
import { HexColorPicker } from "react-colorful";

import "../../styles/Form.css";

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
    <form className="SubtypeForm">
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

      <Fab onClick={handleClick} size="small">
        <AddCircleOutlineSharpIcon sx={{ color: "#706233" }} />
      </Fab>
    </form>
  );
}
