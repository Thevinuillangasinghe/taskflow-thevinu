"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const completionData = [
  { day: "Mon", completed: 4 },
  { day: "Tue", completed: 6 },
  { day: "Wed", completed: 3 },
  { day: "Thu", completed: 8 },
  { day: "Fri", completed: 5 },
  { day: "Sat", completed: 7 },
  { day: "Sun", completed: 4 },
];

const priorityData = [
  { name: "High", value: 5 },
  { name: "Medium", value: 8 },
  { name: "Low", value: 3 },
];

const statusData = [
  { name: "Todo", tasks: 4 },
  { name: "In Progress", tasks: 6 },
  { name: "Done", tasks: 9 },
];

const COLORS = ["#ef4444", "#facc15", "#22c55e"];

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              Analytics
            </h1>

            <p className="mt-2 text-gray-400">
              Productivity insights and task performance overview.
            </p>
          </div>

          <Link
            href="/board"
            className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
          >
            Back to Board
          </Link>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Completion Rate
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-400">
              72%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Avg Tasks / Day
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-400">
              5.3
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Overdue Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-400">
              2
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold">
              Weekly Productivity
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                  <XAxis dataKey="day" stroke="#888" />

                  <YAxis stroke="#888" />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="mb-6 text-2xl font-semibold">
              Priority Distribution
            </h2>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-6 text-2xl font-semibold">
            Task Status Overview
          </h2>

          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                <XAxis dataKey="name" stroke="#888" />

                <YAxis stroke="#888" />

                <Tooltip />

                <Bar
                  dataKey="tasks"
                  fill="#3b82f6"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}