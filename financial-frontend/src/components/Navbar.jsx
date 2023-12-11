import React from "react";

export default function Navbar() {
  return (
    <ul className="Navbar">
      <li className="Navbar-component">
        <a href="http://localhost:3000/"> Main</a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/savings"> Savings</a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/incomes"> Incomes</a>
      </li>
      <li className="Navbar-component">
        <a href="http://localhost:3000/expenses"> Expenses</a>
      </li>
    </ul>
  );
}
