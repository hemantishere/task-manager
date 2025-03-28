import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  const updateTask = async (id) => {
    if (!task.trim()) return;
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task }),
    });
    if (res.ok) {
      const updatedTask = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      setTask("");
      setEditingTask(null);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Manager</h2>
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        {editingTask ? (
          <button
            className="btn btn-success"
            onClick={() => updateTask(editingTask)}
          >
            Update Task
          </button>
        ) : (
          <button className="btn btn-primary" onClick={addTask}>
            Add Task
          </button>
        )}
      </div>
      <ul className="list-group">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {t.text}
            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                  setTask(t.text);
                  setEditingTask(t.id);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTask(t.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
