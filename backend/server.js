const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
    },
  },
  apis: ["./server.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: Success
 */
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a task
 */
app.post("/tasks", async (req, res) => {
  const newTask = new Task({ task: req.body.task });
  await newTask.save();

  const tasks = await Task.find();
  res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 */
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  const tasks = await Task.find();
  res.json(tasks);
});

app.put("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      task: req.body.task,
    });

    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();

    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://Hawaz:Pawli4321@cluster0.4dt104y.mongodb.net/taskmanager?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const taskSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Edit a task
 */
app.put("/tasks/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    task: req.body.task,
  });

  const tasks = await Task.find();
  res.json(tasks);
});

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Toggle task completion
 */
app.patch("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();

  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT}');
});