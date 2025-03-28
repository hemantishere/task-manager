const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

const TASKS_FILE = "tasks.json";

// Load tasks from file
const loadTasks = () => {
  try {
    const data = fs.readFileSync(TASKS_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Save tasks to file
const saveTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get("/tasks", (req, res) => {
  res.json(loadTasks());
});

// Add a task
app.post("/tasks", (req, res) => {
  const { text } = req.body;
  if (!text.trim()) {
    return res.status(400).json({ error: "Task cannot be empty" });
  }
  const tasks = loadTasks();
  const task = { id: Date.now(), text };
  tasks.push(task);
  saveTasks(tasks);
  res.status(201).json(task);
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { text } = req.body;
  if (!text.trim()) {
    return res.status(400).json({ error: "Task cannot be empty" });
  }
  let tasks = loadTasks();
  const taskIndex = tasks.findIndex(
    (task) => task.id === parseInt(req.params.id)
  );
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks[taskIndex].text = text;
  saveTasks(tasks);
  res.status(200).json(tasks[taskIndex]);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.status(200).json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
