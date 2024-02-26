import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { url, headers } from "../helpers";
import useFinanceState from "../hooks/useFinanceState";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState();
  //   const [fetchData] = useFinanceState();

  React.useEffect(() => {
    const getAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${url}/authstatus`,
          { withCredentials: true },
          headers
        );
        setIsAuthenticated(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAuthStatus();
  }, [isAuthenticated]);

  const login = async (user) => {
    try {
      const response = await axios.post(
        `${url}/login`,
        user,
        { withCredentials: true },
        headers
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
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

  const register = async (user) => {
    let response;
    try {
      response = await axios.post(
        `${url}/register`,
        user,
        { withCredentials: true },
        headers
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
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

  const logout = async () => {
    await axios.get(`${url}/logout`, { withCredentials: true }, headers);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
