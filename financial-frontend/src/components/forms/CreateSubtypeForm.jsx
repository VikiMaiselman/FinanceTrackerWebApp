import React, { useState } from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { Fab } from "@mui/material";
import { HexColorPicker } from "react-colorful";

import "../../styles/Form.css";

export default function CreateSubtypeForm({ actions }) {
  const [color, setColor] = useState("");
  const [data, setData] = useState({
    subtName: "",
    tName: "",
  });

  const { addSubtype } = actions;

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateState = (prevState) => {
      return { ...prevState, [name]: value };
    };
    setData(updateState);
  };

  const handleFocus = (event) => {
    event.target.value = "";
  };

  const handleClick = (event) => {
    event.preventDefault();

    const subtype = {
      typeName: data.tName,
      name: data.subtName,
      color: color,
    };

    addSubtype(subtype);
    setData({
      subtName: "",
      tName: "",
    });
  };

  return (
    <form className="SubtypeForm">
      <h3>Create new category: </h3>

      <input
        onChange={handleChange}
        name="subtName"
        value={data.subtName}
        placeholder="Create your name of subcategory..."
      />

      <input
        name="tName"
        value={data.tName}
        list={`datalist-cats`}
        placeholder="Select the main category..."
        onChange={handleChange}
        onFocus={handleFocus}
        autoComplete="off"
      />
      <datalist id={`datalist-cats`}>
        <option value={"Incomes"} />
        <option value={"Expenses"} />
        <option value={"Savings"} />
      </datalist>

      <HexColorPicker color={color} onChange={setColor} />
      <p>Current color is {color}</p>

      <Fab onClick={handleClick} size="small">
        <AddCircleOutlineSharpIcon sx={{ color: "#706233" }} />
      </Fab>
    </form>
  );
}
