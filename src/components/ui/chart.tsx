"use client";

import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";

interface ChartProps {
  data: any[];
  type?: "area" | "bar";
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 border border-border bg-surface shadow-xl rounded-lg text-xs">
        <p className="font-semibold text-primary mb-1">{label}</p>
        <p className="text-accent font-mono">
          {valueFormatter ? valueFormatter(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export function Chart({
  data,
  type = "area",
  xKey,
  yKey,
  color = "#6366F1", // --accent
  height = 300,
  valueFormatter,
}: ChartProps) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${yKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A3A" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA7", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA7", fontSize: 12 }}
              tickFormatter={valueFormatter}
              width={60}
            />
            <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ stroke: "#2A2A3A", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${yKey})`}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A3A" />
            <XAxis
              dataKey={xKey}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA7", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8BA7", fontSize: 12 }}
              tickFormatter={valueFormatter}
              width={60}
            />
            <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} cursor={{ fill: "#1A1A26" }} />
            <Bar
              dataKey={yKey}
              fill={color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
