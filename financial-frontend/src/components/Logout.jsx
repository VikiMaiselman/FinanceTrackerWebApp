import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/Auth.context";

export default function Logout() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    const logout = async () => {
      await auth.logout();
    };
    logout();
    navigate("/", { replace: true });
  }, []);

  return <></>;
}
