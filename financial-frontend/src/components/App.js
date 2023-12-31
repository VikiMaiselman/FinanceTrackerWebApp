import React, { useEffect, useState } from "react";
import "../styles/App.css";
import AppRouter from "./AppRouter";
import Login from "./forms/Login";

import axios from "axios";
const url = "http://localhost:3007/authstatus";
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "http://localhost:3000",
};

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
