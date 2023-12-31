import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const url = "http://localhost:3007";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

export default function Logout({ changeAuthStatus }) {
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      await axios.get(`${url}/logout`, { withCredentials: true }, headers);
    };
    logout();
    changeAuthStatus(false, () => {
      console.log("i just called backend logout");
      navigate("/", { replace: true });
    });
  }, []);

  return <></>;
}
