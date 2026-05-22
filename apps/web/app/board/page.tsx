"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
  count,
  children,
}: {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{title}</h2>

        <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300">
          {count}
        </span>
      </div>

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

  function getPriorityStyle(priority?: string) {
    if (priority === "high") {
      return "border-red-500/30 bg-red-500/10 text-red-300";
    }

    if (priority === "low") {
      return "border-green-500/30 bg-green-500/10 text-green-300";
    }

    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  }

  function getTaskCount(status: string) {
    return tasks.filter((task) => task.status === status).length;
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
      toast.error("Failed to fetch tasks");
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
      toast.error("Failed to fetch activity logs");
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
    if (!newTaskTitle) {
      toast.error("Task title is required");
      return;
    }

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
        toast.error(data.error || "Failed to create task");
        return;
      }

      setNewTaskTitle("");
      fetchTasks();
      toast.success("Task created");
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
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
        toast.error(data.error || "Failed to update task");
        return;
      }

      fetchTasks();

      if (selectedTask?.id === id) {
        setSelectedTask({ ...selectedTask, status });
      }

      toast.success("Task updated");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
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
        toast.error(data.error || "Failed to update task");
        return;
      }

      setSelectedTask(data.task);
      fetchTasks();
      openTask(data.task);
      toast.success("Task updated");
    } catch (error) {
      console.error("Failed to save task changes:", error);
      toast.error("Failed to update task");
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
        toast.error(data.error || "Failed to delete task");
        return;
      }

      setSelectedTask(null);
      setActivityLogs([]);
      fetchTasks();
      toast.success("Task deleted");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
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

  function renderEmptyState() {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-gray-500">
        No tasks yet
      </div>
    );
  }

  function renderTaskCard(task: Task) {
    return (
      <DraggableTask key={task.id} task={task}>
        <div
          onClick={() => openTask(task)}
          className="cursor-grab rounded-xl border border-white/10 bg-white/10 p-4 shadow transition hover:-translate-y-1 hover:bg-white/15 active:cursor-grabbing"
        >
          <p className="font-semibold text-white">{task.title}</p>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-400">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs capitalize ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority || "medium"}
            </span>

            <span className="text-xs text-gray-500">
              {task.assignee || "Unassigned"}
            </span>
          </div>
        </div>
      </DraggableTask>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-bold tracking-tight">Task Board</h1>
            <p className="mt-2 text-gray-400">
              Manage your workflow efficiently with TaskFlow.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-red-400 transition hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-blue-500"
            />

            <button
              onClick={createTask}
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Add Task
            </button>
          </div>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="grid gap-6 lg:grid-cols-3">
            <DroppableColumn id="todo" title="Todo" count={getTaskCount("todo")}>
              {getTaskCount("todo") === 0
                ? renderEmptyState()
                : tasks
                    .filter((task) => task.status === "todo")
                    .map((task) => renderTaskCard(task))}
            </DroppableColumn>

            <DroppableColumn
              id="in-progress"
              title="In Progress"
              count={getTaskCount("in-progress")}
            >
              {getTaskCount("in-progress") === 0
                ? renderEmptyState()
                : tasks
                    .filter((task) => task.status === "in-progress")
                    .map((task) => renderTaskCard(task))}
            </DroppableColumn>

            <DroppableColumn id="done" title="Done" count={getTaskCount("done")}>
              {getTaskCount("done") === 0
                ? renderEmptyState()
                : tasks
                    .filter((task) => task.status === "done")
                    .map((task) => renderTaskCard(task))}
            </DroppableColumn>
          </div>
        </DndContext>

        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-gray-950 p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Edit Task</h2>

                <button
                  onClick={() => setSelectedTask(null)}
                  className="rounded-lg bg-white/10 px-3 py-2 transition hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Title
                  </label>

                  <input
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Description
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(event) => setEditDescription(event.target.value)}
                    className="min-h-[120px] w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Priority
                    </label>

                    <select
                      value={editPriority}
                      onChange={(event) => setEditPriority(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Due Date
                    </label>

                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(event) => setEditDueDate(event.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Assignee
                  </label>

                  <input
                    value={editAssignee}
                    onChange={(event) => setEditAssignee(event.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Status
                  </label>

                  <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300">
                    {selectedTask.status}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={saveTaskChanges}
                  className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-red-400 transition hover:bg-red-500/20"
                >
                  Delete Task
                </button>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-xl font-semibold">Activity Log</h3>

                <div className="space-y-3">
                  {activityLogs.length === 0 && (
                    <p className="text-sm text-gray-500">No activity yet.</p>
                  )}

                  {activityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <p>{log.action}</p>

                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}