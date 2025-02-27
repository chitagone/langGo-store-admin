"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
interface GraphData {
  name: string;
  total: number;
}
interface OverViewProps {
  data: GraphData[];
}

export const OverView: React.FC<OverViewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name" // Make sure to add dataKey to XAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₭${value}`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};
