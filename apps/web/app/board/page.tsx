"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

type Task = {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  workspaceId: number;
};

type ActivityLog = {
  id: number;
  action: string;
  createdAt: string;
};

function DraggableTask({
  task,
  children,
}: {
  task: Task;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}

function DroppableColumn({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl bg-white p-4 shadow ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function BoardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editAssignee, setEditAssignee] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  function getToken() {
    return localStorage.getItem("token");
  }

  function getApiUrl() {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  async function fetchTasks() {
    try {
      const response = await fetch(`${getApiUrl()}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  async function openTask(task: Task) {
    setSelectedTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority || "medium");
    setEditAssignee(task.assignee || "");
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");

    try {
      const response = await fetch(
        `${getApiUrl()}/api/tasks/${task.id}/activity`
      );

      const data = await response.json();
      setActivityLogs(data.activityLogs || []);
    } catch (error) {
      console.error("Failed to fetch activity logs:", error);
    }
  }

  useEffect(() => {
    const token = getToken();

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchTasks();
  }, []);

  async function createTask() {
    if (!newTaskTitle) return;

    try {
      const response = await fetch(`${getApiUrl()}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: "",
          status: "todo",
          priority: "medium",
          assignee: "Thevinu",
          workspaceId: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create task");
        return;
      }

      setNewTaskTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  async function updateTaskStatus(id: number, status: string) {
    try {
      const response = await fetch(`${getApiUrl()}/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task");
        return;
      }

      fetchTasks();

      if (selectedTask?.id === id) {
        setSelectedTask({ ...selectedTask, status });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  async function saveTaskChanges() {
    if (!selectedTask) return;

    try {
      const response = await fetch(
        `${getApiUrl()}/api/tasks/${selectedTask.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            assignee: editAssignee,
            dueDate: editDueDate || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task");
        return;
      }

      setSelectedTask(data.task);
      fetchTasks();
      openTask(data.task);
    } catch (error) {
      console.error("Failed to save task changes:", error);
    }
  }

  async function deleteTask(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");

    if (!confirmed) return;

    try {
      const response = await fetch(`${getApiUrl()}/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete task");
        return;
      }

      setSelectedTask(null);
      setActivityLogs([]);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);
    const task = tasks.find((task) => task.id === taskId);

    if (!task || task.status === newStatus) return;

    await updateTaskStatus(taskId, newStatus);
  }

  function renderTaskCard(task: Task) {
    return (
      <DraggableTask key={task.id} task={task}>
        <div
          onClick={() => openTask(task)}
          className="cursor-grab rounded-lg bg-gray-100 p-3 active:cursor-grabbing"
        >
          <p className="font-medium">{task.title}</p>
          <p className="text-sm text-gray-600">
            Priority: {task.priority || "medium"}
          </p>
        </div>
      </DraggableTask>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Task Board</h1>

        <button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 flex gap-4 rounded-xl bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          className="flex-1 rounded-lg border px-4 py-2"
        />

        <button
          onClick={createTask}
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Add Task
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          <DroppableColumn id="todo" title="Todo">
            {tasks
              .filter((task) => task.status === "todo")
              .map((task) => renderTaskCard(task))}
          </DroppableColumn>

          <DroppableColumn id="in-progress" title="In Progress">
            {tasks
              .filter((task) => task.status === "in-progress")
              .map((task) => renderTaskCard(task))}
          </DroppableColumn>

          <DroppableColumn id="done" title="Done">
            {tasks
              .filter((task) => task.status === "done")
              .map((task) => renderTaskCard(task))}
          </DroppableColumn>
        </div>
      </DndContext>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Task</h2>

              <button onClick={() => setSelectedTask(null)} className="text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-semibold">Title</label>
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">Status</label>
                <p className="rounded-lg bg-gray-100 px-3 py-2">
                  {selectedTask.status}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Priority
                </label>
                <select
                  value={editPriority}
                  onChange={(event) => setEditPriority(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Assignee
                </label>
                <input
                  value={editAssignee}
                  onChange={(event) => setEditAssignee(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(event) => setEditDueDate(event.target.value)}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={saveTaskChanges}
                className="rounded-lg bg-black px-4 py-2 text-white"
              >
                Save Changes
              </button>

              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Delete Task
              </button>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-lg font-semibold">Activity Log</h3>

              <div className="space-y-2">
                {activityLogs.length === 0 && (
                  <p className="text-sm text-gray-500">No activity yet.</p>
                )}

                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="rounded-lg bg-gray-100 p-2 text-sm"
                  >
                    <p>{log.action}</p>
                    <p className="text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}