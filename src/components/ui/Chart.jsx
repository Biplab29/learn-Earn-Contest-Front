import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";

const Chart = ({ data = [] }) => {
  const { dark } = useTheme();
  const axisColor = dark ? "#94a3b8" : "#64748b";
  const gridColor = dark ? "#334155" : "#dbe4ee";
  const tooltipStyle = {
    backgroundColor: dark ? "rgba(15, 23, 42, 0.96)" : "rgba(255, 255, 255, 0.97)",
    borderColor: dark ? "#334155" : "#dbe4ee",
    color: dark ? "#e5e7eb" : "#0f172a",
    borderRadius: "16px",
    boxShadow: dark
      ? "0 18px 40px rgba(2, 6, 23, 0.42)"
      : "0 18px 40px rgba(15, 23, 42, 0.12)",
  };

  return (
    <div className="col-span-2 rounded-2xl p-5">
      <h3 className="theme-text mb-4 font-semibold">Dashboard Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }} />
          <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{
              fill: dark
                ? "rgba(148, 163, 184, 0.08)"
                : "rgba(15, 23, 42, 0.04)",
            }}
          />

          {/* ✅ FIXED */}
          <Bar dataKey="value" fill="#82C600" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

