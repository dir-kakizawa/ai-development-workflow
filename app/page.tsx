"use client";

import { useState, useEffect } from "react";

type Status = "pending" | "running" | "completed";
type Priority = "low" | "medium" | "high";

interface SubTask {
  id: string;
  title: string;
  status: Status;
  createdAt: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  subtasks: SubTask[];
  createdAt: number;
}

type FilterType = "all" | Status;
type SortType = "newest" | "oldest" | "priority" | "dueDate" | "status";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tasks");
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [];
  });
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "subtasks">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setEditingTaskId(null);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const addSubtask = (taskId: string, title: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSubtask: SubTask = {
      id: crypto.randomUUID(),
      title,
      status: "pending",
      createdAt: Date.now(),
    };

    updateTask(taskId, {
      subtasks: [...task.subtasks, newSubtask],
    });
  };

  const updateSubtask = (
    taskId: string,
    subtaskId: string,
    updates: Partial<SubTask>
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask(taskId, {
      subtasks: task.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, ...updates } : st
      ),
    });
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateTask(taskId, {
      subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
    });
  };

  const getFilteredAndSortedTasks = () => {
    let filtered = tasks;

    if (filter !== "all") {
      filtered = tasks.filter((t) => t.status === filter);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "priority": {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "dueDate":
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "status": {
          const statusOrder = { running: 0, pending: 1, completed: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        default:
          return 0;
      }
    });

    return sorted;
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "running":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const running = tasks.filter((t) => t.status === "running").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    return { total, completed, running, pending };
  };

  const stats = getStats();
  const filteredTasks = getFilteredAndSortedTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Task Manager
          </h1>
          <p className="text-slate-600">
            Organize your tasks and boost productivity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
            <div className="text-sm text-slate-600">Running</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <div className="text-2xl font-bold text-slate-600">{stats.pending}</div>
            <div className="text-sm text-slate-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="status">Status</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddingTask(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* Add Task Form */}
        {isAddingTask && (
          <TaskForm
            onSubmit={addTask}
            onCancel={() => setIsAddingTask(false)}
          />
        )}

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">No tasks found</p>
              <p className="text-slate-400 text-sm mt-2">
                Create a new task to get started
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
              >
                {editingTaskId === task.id ? (
                  <TaskForm
                    task={task}
                    onSubmit={(updates) => updateTask(task.id, updates)}
                    onCancel={() => setEditingTaskId(null)}
                  />
                ) : (
                  <>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-slate-600 text-sm">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTaskId(task.id)}
                            className="px-3 py-1 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-3 py-1 text-sm text-slate-600 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            updateTask(task.id, {
                              status: e.target.value as Status,
                            })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            task.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="running">Running</option>
                          <option value="completed">Completed</option>
                        </select>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}{" "}
                          Priority
                        </span>

                        {task.dueDate && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}

                        {task.subtasks.length > 0 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {
                              task.subtasks.filter(
                                (st) => st.status === "completed"
                              ).length
                            }
                            /{task.subtasks.length} subtasks
                          </span>
                        )}
                      </div>

                      {task.subtasks.length > 0 && (
                        <button
                          onClick={() =>
                            setExpandedTaskId(
                              expandedTaskId === task.id ? null : task.id
                            )
                          }
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {expandedTaskId === task.id
                            ? "Hide Subtasks"
                            : "Show Subtasks"}
                        </button>
                      )}
                    </div>

                    {expandedTaskId === task.id && (
                      <div className="border-t border-slate-200 bg-slate-50 p-5">
                        <SubtaskList
                          taskId={task.id}
                          subtasks={task.subtasks}
                          onAdd={addSubtask}
                          onUpdate={updateSubtask}
                          onDelete={deleteSubtask}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Task Form Component
function TaskForm({
  task,
  onSubmit,
  onCancel,
}: {
  task?: Task;
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "subtasks">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<Status>(task?.status || "pending");
  const [priority, setPriority] = useState<Priority>(task?.priority || "medium");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, description, status, priority, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        {task ? "Edit Task" : "New Task"}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Enter task description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {task ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Subtask List Component
function SubtaskList({
  taskId,
  subtasks,
  onAdd,
  onUpdate,
  onDelete,
}: {
  taskId: string;
  subtasks: SubTask[];
  onAdd: (taskId: string, title: string) => void;
  onUpdate: (taskId: string, subtaskId: string, updates: Partial<SubTask>) => void;
  onDelete: (taskId: string, subtaskId: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    onAdd(taskId, newSubtaskTitle);
    setNewSubtaskTitle("");
    setIsAdding(false);
  };

  const handleEdit = (subtask: SubTask) => {
    setEditingId(subtask.id);
    setEditTitle(subtask.title);
  };

  const handleUpdate = (subtaskId: string) => {
    if (!editTitle.trim()) return;
    onUpdate(taskId, subtaskId, { title: editTitle });
    setEditingId(null);
    setEditTitle("");
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "running":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-slate-900">Subtasks</h4>
        <button
          onClick={() => setIsAdding(true)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Subtask
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Subtask title"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewSubtaskTitle("");
              }}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {subtasks.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No subtasks yet
          </p>
        ) : (
          subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200"
            >
              {editingId === subtask.id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdate(subtask.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditTitle("");
                    }}
                    className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">{subtask.title}</p>
                  </div>
                  <select
                    value={subtask.status}
                    onChange={(e) =>
                      onUpdate(taskId, subtask.id, {
                        status: e.target.value as Status,
                      })
                    }
                    className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                      subtask.status
                    )}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => handleEdit(subtask)}
                    className="text-sm text-slate-600 hover:text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(taskId, subtask.id)}
                    className="text-sm text-slate-600 hover:text-red-600"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
