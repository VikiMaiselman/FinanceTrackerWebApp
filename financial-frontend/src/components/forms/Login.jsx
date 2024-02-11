import React, { useState } from "react";
import { FormHelperText, InputLabel, Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { ThemeProvider } from "@mui/material/styles";

import Swal from "sweetalert2";

import "../../styles/Authentication.css";
import { AuthContext } from "../../contexts/Auth.context";
import { CustomThemeContext } from "../../contexts/CustomTheme.context";

export default function Login() {
  const auth = React.useContext(AuthContext);
  const { theme } = React.useContext(CustomThemeContext);

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
    await auth.login(user);
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

    await auth.register(user);
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
