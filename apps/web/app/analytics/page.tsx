"use client";

import { useEffect, useState } from "react";
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

type Task = {
  id: number;
  title: string;
  status: string;
  priority?: string;
  dueDate?: string;
};

const COLORS = ["#ef4444", "#facc15", "#22c55e"];

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = localStorage.getItem("token");

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:4000";

        const response = await fetch(
          `${apiUrl}/api/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setTasks(data.tasks || []);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTasks();
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    return (
      new Date(task.dueDate) < new Date() &&
      task.status !== "done"
    );
  }).length;

  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const priorityData = [
    {
      name: "High",
      value: tasks.filter(
        (task) => task.priority === "high"
      ).length,
    },
    {
      name: "Medium",
      value: tasks.filter(
        (task) => task.priority === "medium"
      ).length,
    },
    {
      name: "Low",
      value: tasks.filter(
        (task) => task.priority === "low"
      ).length,
    },
  ];

  const statusData = [
    {
      name: "Todo",
      tasks: tasks.filter(
        (task) => task.status === "todo"
      ).length,
    },
    {
      name: "In Progress",
      tasks: tasks.filter(
        (task) => task.status === "in-progress"
      ).length,
    },
    {
      name: "Done",
      tasks: tasks.filter(
        (task) => task.status === "done"
      ).length,
    },
  ];

  const productivityData = [
    {
      day: "Mon",
      completed: completedTasks,
    },
    {
      day: "Tue",
      completed: Math.max(completedTasks - 1, 0),
    },
    {
      day: "Wed",
      completed: Math.max(completedTasks - 2, 0),
    },
    {
      day: "Thu",
      completed: completedTasks + 1,
    },
    {
      day: "Fri",
      completed: completedTasks,
    },
    {
      day: "Sat",
      completed: Math.max(completedTasks - 1, 0),
    },
    {
      day: "Sun",
      completed: completedTasks + 2,
    },
  ];

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

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Total Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {tasks.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Completion Rate
            </p>

            <h2 className="mt-3 text-4xl font-bold text-green-400">
              {completionRate}%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Completed Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold text-blue-400">
              {completedTasks}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm text-gray-400">
              Overdue Tasks
            </p>

            <h2 className="mt-3 text-4xl font-bold text-red-400">
              {overdueTasks}
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
                <LineChart data={productivityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                  />

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
                        fill={
                          COLORS[index % COLORS.length]
                        }
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
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#333"
                />

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