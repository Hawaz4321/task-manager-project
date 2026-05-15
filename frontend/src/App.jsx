import { useState, useEffect } from "react";

const API = "https://task-manager-project-uw4u.onrender.com";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`${API}/tasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: input }),
    });

    const data = await res.json();
    setTasks(data);
    setInput("");
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setTasks(data);
  };

  const editTask = async (id, currentTask) => {
    const newTask = prompt("Edit task:", currentTask);
    if (!newTask || !newTask.trim()) return;

    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask }),
    });

    const data = await res.json();
    setTasks(data);
  };

  const toggleComplete = async (id) => {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: "PATCH",
    });

    const data = await res.json();
    setTasks(data);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Task Manager</h1>

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.task}
            </span>

            <button onClick={() => toggleComplete(task._id)}>
              {task.completed ? "Undo" : "Done"}
            </button>

            <button onClick={() => editTask(task._id, task.task)}>
              Edit
            </button>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}