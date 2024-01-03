import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import React from "react";

export default function CustomBarChart({ data }) {
  const renderLabel = function (entry) {
    return `${entry.name} (${entry.subtotal}₪)`;
  };

  return (
    <BarChart
      width={730}
      height={250}
      data={data}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="subtotal" fill="fill" />
    </BarChart>
  );
}
