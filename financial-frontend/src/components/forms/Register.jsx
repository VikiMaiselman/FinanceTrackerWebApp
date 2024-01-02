import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Button,
} from "@mui/material";

import axios from "axios";

const url = "http://localhost:3007/register";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function Register({ changeStatus }) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    const updateState = (prevState) => {
      return { ...prevState, [name]: value };
    };
    setUser(updateState);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        url,
        user,
        { withCredentials: true },
        headers
      );

      if (response.status === 200) {
        changeStatus(true);
      }

      console.log(response);
    } catch (error) {}
  };

  return (
    <form className="Transaction TransactionForm">
      <input
        required={true}
        onChange={handleChange}
        name="username"
        value={user.username}
        placeholder="Username..."
        autoComplete="off"
      />
      <input
        required={true}
        onChange={handleChange}
        name="password"
        value={user.password}
        type={"password"}
        autoComplete="off"
      />

      <div>
        <button onClick={handleClick}>Register</button>
      </div>
    </form>
  );
}
