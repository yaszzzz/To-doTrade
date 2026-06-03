"use client";

import { formatCurrency } from "@/lib/utils";
import type { AnalyticsData } from "@/lib/actions/analytics.actions";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = {
  win: "#22c55e",
  loss: "#ef4444",
  breakeven: "#64748b",
};

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsData }) {
  const pieData = [
    {
      name: "Wins",
      value: analytics.winLossDistribution.wins,
      color: COLORS.win,
    },
    {
      name: "Losses",
      value: analytics.winLossDistribution.losses,
      color: COLORS.loss,
    },
    {
      name: "Breakeven",
      value: analytics.winLossDistribution.breakeven,
      color: COLORS.breakeven,
    },
  ].filter((item) => item.value > 0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Cumulative P&L">
          {analytics.plOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.plOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? formatCurrency(value) : value
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cumulativePL"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Cumulative P&L"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No closed trades yet" />
          )}
        </ChartCard>

        <ChartCard title="Win/Loss Distribution">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(((percent ?? 0) as number) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No closed trades yet" />
          )}
        </ChartCard>
      </div>

      <ChartCard title="Trade Frequency by Month">
        {analytics.tradeFrequency.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.tradeFrequency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Trades" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="No trades yet" />
        )}
      </ChartCard>
    </>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center text-slate-500">
      {message}
    </div>
  );
}