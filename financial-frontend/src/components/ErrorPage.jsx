import React from "react";

export default function ErrorPage({ error }) {
  return (
    <div className="AllTransactions">
      <h1>Oh-oughh!.. Something went wrong :(</h1>
      <h4>{error.message}</h4>
    </div>
  );
}
