import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import CurrencyExchangeSharpIcon from "@mui/icons-material/CurrencyExchangeSharp";
import ReorderTwoToneIcon from "@mui/icons-material/ReorderTwoTone";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";

export default function Navbar() {
  const [isFixed, setIsFixed] = useState(false);

  const defineIfFixed = () => setIsFixed(window.scrollY >= 50);

  useEffect(() => {
    window.addEventListener("scroll", defineIfFixed);
    return () => window.removeEventListener("scroll", defineIfFixed);
  }, []);

  return (
    <ul className={isFixed ? "Navbar scroll" : "Navbar"}>
      <li className="Navbar-component">
        <Link to="/">
          <AccountBalanceSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;All Finance
        </Link>
      </li>
      <li className="Navbar-component">
        <Link to="/savings">
          <SavingsOutlinedIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Savings
        </Link>
      </li>
      <li className="Navbar-component">
        <Link to="/incomes">
          <AddCircleOutlineSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Incomes
        </Link>
      </li>
      <li className="Navbar-component">
        <Link to="/expenses">
          {" "}
          <CurrencyExchangeSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Expenses
        </Link>
      </li>
      <li className="Navbar-component">
        <Link to="/wishes">
          <ReorderTwoToneIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Wishes
        </Link>
      </li>
      <li className="Navbar-component">
        <Link to="/logout">
          <LogoutSharpIcon sx={{ fontSize: "1rem", verticalAlign: "-2px" }} />
          &nbsp;Logout
        </Link>
      </li>
    </ul>
  );
}
