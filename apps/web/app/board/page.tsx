"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  status: string;
  workspaceId: number;
};

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] =
    useState("");

  async function fetchTasks() {
    try {
      const response = await fetch(
        "http://localhost:4000/api/tasks"
      );

      const data = await response.json();

      setTasks(data.tasks || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function createTask() {
    if (!newTaskTitle) return;

    try {
      await fetch(
        "http://localhost:4000/api/tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTaskTitle,
            status: "todo",
            workspaceId: 1,
          }),
        }
      );

      setNewTaskTitle("");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateTaskStatus(
    id: number,
    status: string
  ) {
    try {
      await fetch(
        `http://localhost:4000/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8">
        Task Board
      </h1>

      {/* CREATE TASK */}
      <div className="bg-white p-4 rounded-xl shadow mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(e) =>
            setNewTaskTitle(e.target.value)
          }
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <button
          onClick={createTask}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* TODO */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Todo
          </h2>

          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === "todo")
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <p className="font-medium">
                    {task.title}
                  </p>

                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        "in-progress"
                      )
                    }
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Move to In Progress
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            In Progress
          </h2>

          <div className="space-y-3">
            {tasks
              .filter(
                (task) =>
                  task.status === "in-progress"
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <p className="font-medium">
                    {task.title}
                  </p>

                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        "done"
                      )
                    }
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Move to Done
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* DONE */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Done
          </h2>

          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === "done")
              .map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-100 p-3 rounded-lg"
                >
                  <p className="font-medium">
                    {task.title}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}