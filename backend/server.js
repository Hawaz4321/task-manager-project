const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB
mongoose
  .connect(
    "mongodb+srv://Hawaz:Pawli4321@cluster0.4dt104y.mongodb.net/taskmanager?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const taskSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

// GET
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST
app.post("/tasks", async (req, res) => {
  const newTask = new Task({ task: req.body.task });
  await newTask.save();

  const tasks = await Task.find();
  res.json(tasks);
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  const tasks = await Task.find();
  res.json(tasks);
});

// PUT (edit task)
app.put("/tasks/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    task: req.body.task,
  });

  const tasks = await Task.find();
  res.json(tasks);
});

// PATCH (toggle complete)
app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();

  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});