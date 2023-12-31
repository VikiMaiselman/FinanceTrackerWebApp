import React, { useState } from "react";

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
        <a href="http://localhost:3000/"> All Finance</a>
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
      <li className="Navbar-component">
        <a href="http://localhost:3000/logout"> Logout</a>
      </li>
    </ul>
  );
}
