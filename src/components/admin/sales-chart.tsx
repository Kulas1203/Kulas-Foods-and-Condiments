"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface SalesChartProps {
  data: { month: string; revenue: number; orders: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF5A36" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FF5A36" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="month"
          stroke="#A0A0A0"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#A0A0A0"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `₱${v / 1000}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#1B1B1B",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            color: "#fff",
          }}
          formatter={(value: number) => [`₱${value.toLocaleString()}`, "Revenue"]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#FF5A36"
          strokeWidth={2.5}
          fill="url(#rev)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
