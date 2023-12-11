import React, { useState } from "react";
import "../styles/App.css";
import AllTransactions from "./AppRouter";
import ErrorPage from "./ErrorPage";

function App() {
  const [error, setError] = useState({
    isError: false,
    message: "",
  });

  const toRender = (
    <div className="App">
      {error.isError ? (
        <ErrorPage error={error} />
      ) : (
        <AllTransactions errorHandler={setError} />
      )}
    </div>
  );

  return toRender;
}

export default App;
