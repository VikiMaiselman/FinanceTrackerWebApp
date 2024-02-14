import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import React from "react";
import { FinanceContext } from "../contexts/Finance.context";

export default function CustomBarChart() {
  const renderLabel = function (entry) {
    return `${entry.name} (${entry.subtotal}₪)`;
  };

  const { financeState } = React.useContext(FinanceContext);
  const colorTypes = ["#9A4444", "#D6D46D", "#DE8F5F"];
  const data = financeState.generalStructure?.types?.map((type, idx) => {
    const subtotal = financeState.allTransactions
      .filter((tx) => tx.typeName === type.name)
      .reduce((acc, tx) => acc + tx.sum, 0);
    return {
      name: type.name,
      subtotal: subtotal,
      fill: colorTypes[idx],
    };
  });

  return (
    <BarChart width={730} height={250} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="subtotal" fill="fill" />
    </BarChart>
  );
}
