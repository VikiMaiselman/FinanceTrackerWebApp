import React, { useState } from "react";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import CurrencyExchangeSharpIcon from "@mui/icons-material/CurrencyExchangeSharp";
import ReorderTwoToneIcon from "@mui/icons-material/ReorderTwoTone";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";

export default function Navbar() {
  const [isFixed, setIsFixed] = useState(false);

  const defineIfFixed = () => {
    if (window.scrollY >= 50) setIsFixed(true);
    if (window.scrollY < 50) setIsFixed(false);
  };
  window.addEventListener("scroll", defineIfFixed);

  return (
    <ul className={isFixed ? "Navbar scroll" : "Navbar"}>
      <li className="Navbar-component">
        <a href="http://localhost:3000/">
          <AccountBalanceSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;All Finance
        </a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/savings">
          {" "}
          <SavingsOutlinedIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Savings
        </a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/incomes">
          <AddCircleOutlineSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Incomes
        </a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/expenses">
          {" "}
          <CurrencyExchangeSharpIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Expenses
        </a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/wishes">
          <ReorderTwoToneIcon
            sx={{ fontSize: "1rem", verticalAlign: "-2px" }}
          />
          &nbsp;Wishes
        </a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/logout">
          <LogoutSharpIcon sx={{ fontSize: "1rem", verticalAlign: "-2px" }} />
          &nbsp;Logout
        </a>
      </li>
    </ul>
  );
}
