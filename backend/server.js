const express = require("express");
const cors = require("cors");
let tasks = [];
const app = express();
app.use(cors());
app.use(express.json());

// Get all tasks
app.get("/tasks", (req, res) => res.json(tasks));

// Add a task
app.post("/tasks", (req, res) => {
  const task = { id: Date.now(), text: req.body.text };
  tasks.push(task);
  res.status(201).json(task);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  tasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
  res.status(200).json({ message: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
