const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for todos
let todos = [
  { id: 1, task: "Learn Docker", completed: false },
  { id: 2, task: "Set up CI/CD", completed: false }
];

let nextId = 3;

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// GET single todo
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

// POST create new todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task is required' });
  }
  
  const newTodo = {
    id: nextId++,
    task: task,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo
app.put('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  const { task, completed } = req.body;
  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;
  
  res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(index, 1);
  res.status(204).send();
});

// Root endpoint with API info
app.get('/', (req, res) => {
  res.json({
    message: "Todo API is running!",
    endpoints: {
      "GET /todos": "Get all todos",
      "GET /todos/:id": "Get specific todo",
      "POST /todos": "Create new todo",
      "PUT /todos/:id": "Update todo",
      "DELETE /todos/:id": "Delete todo"
    }
  });
});

app.listen(port, () => {
  console.log(`Todo API running on port ${port}`);
});
