import React, { useState } from "react";
import { FormHelperText, InputLabel, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "../../styles/Authentication.css";

import Swal from "sweetalert2";
import axios from "axios";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

const theme = createTheme({
  palette: {
    login: {
      main: "#3f3f3f",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
    register: {
      main: "#5f6f52",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#ffffff",
    },
  },
});

export default function Login({ changeAuthStatus }) {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    const updateState = (prevState) => {
      return { ...prevState, [name]: value };
    };
    setUser(updateState);
  };

  const handleLoginClick = async (event) => {
    event.preventDefault();
    if (!user.username || !user.password) {
      Swal.fire({
        title: "Ooops!",
        text: "Looks like you did not provide all the necessary info",
        icon: "error",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${url}/login`,
        user,
        { withCredentials: true },
        headers
      );

      if (response.status === 200) {
        changeAuthStatus(true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops!",
        text: "This user does not exist. Are you sure you don't need to sign up?",
        icon: "error",
      });
    }
  };

  const handleRegisterClick = async (event) => {
    event.preventDefault();
    if (!user.username || !user.password) {
      Swal.fire({
        title: "Ooops!",
        text: "Looks like you did not provide all the necessary info",
        icon: "error",
      });
      return;
    }

    let response;
    try {
      response = await axios.post(
        `${url}/register`,
        user,
        { withCredentials: true },
        headers
      );

      if (response.status === 200) {
        changeAuthStatus(true);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Ooops!",
        text: error.response.data.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="AllTransactions">
      <h1>Login | Register</h1>
      <form className="Auth-form">
        <InputLabel htmlFor="username">*Username:</InputLabel>
        <input
          onChange={handleChange}
          id="username"
          name="username"
          value={user.username}
          autoComplete="off"
          required
        />

        <InputLabel htmlFor="password">*Password:</InputLabel>
        <input
          onChange={handleChange}
          name="password"
          value={user.password}
          type={"password"}
          autoComplete="off"
          required
        />

        <FormHelperText>
          We won't use your information. We just want to save your financial
          information safely.
        </FormHelperText>

        <div className="Auth-btns">
          <ThemeProvider theme={theme}>
            <Button
              className="Auth-btn"
              onClick={handleLoginClick}
              variant="contained"
              color="login"
            >
              <LoginIcon /> Login
            </Button>
          </ThemeProvider>

          <ThemeProvider theme={theme}>
            <Button
              className="Auth-btn"
              onClick={handleRegisterClick}
              variant="contained"
              color="register"
            >
              <HowToRegIcon />
              {"  "}
              Signup
            </Button>
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}
