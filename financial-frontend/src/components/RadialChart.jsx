import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { PureComponent } from "react";

export default function RadialChart({ dataForChart }) {
  console.log("chart", dataForChart.subdata);

  const data = [
    ...dataForChart.subdata,
    { name: "Current financial state as", subtotal: 100, fill: "#B0926A" },
  ];
  console.log("data", data);

  return (
    <RadialBarChart
      background="white"
      width={500}
      height={300}
      cx={100}
      cy={150}
      innerRadius={10}
      outerRadius={60}
      barSize={5}
      data={data}
    >
      <RadialBar
        minAngle={15}
        // label={{ position: "insideStart", fill: "#fff" }}
        // background
        clockWise
        dataKey="subtotal"
      />
      <Legend
        payload={data.map((item, idx) => {
          return {
            value: `${item.name} - ${item.subtotal.toFixed(0)}%`,
            color: item.fill,
            type: "line",
            id: `ID${idx}`,
          };
        })}
        iconSize={15}
        width={190}
        height={80}
        layout="vertical"
        verticalAlign="middle"
        // iconType="circle"
      />
    </RadialBarChart>
  );
}
