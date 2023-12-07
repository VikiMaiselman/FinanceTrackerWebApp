import { PieChart, Pie } from "recharts";
import React, { PureComponent } from "react";

export default function CustomPieChart({ data }) {
  console.log("data", data);
  return (
    <PieChart width={730} height={250}>
      <Pie
        data={data}
        dataKey="subtotal"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={60}
        // outerRadius={80}
        fill={`#${data.subdata.fill}`}
        label
      />
    </PieChart>
  );
}
