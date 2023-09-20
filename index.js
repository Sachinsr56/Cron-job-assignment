const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const TODOS_FILE = path.join(__dirname, 'todos.json');

// Initialize todos array
let todos = [];

// Read data from the todos.json file (if it exists)
fs.readFile(TODOS_FILE, 'utf8', (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      // If the file doesn't exist, create it with an empty array
      fs.writeFile(TODOS_FILE, '[]', (err) => {
        if (err) {
          console.error('Error creating todos.json:', err);
        } else {
          console.log('Created an empty todos.json file.');
        }
      });
    } else {
      console.error('Error reading todos.json:', err);
    }
  } else {
    // Parse the data from todos.json
    try {
      todos = JSON.parse(data);
      console.log('Initial data loaded from todos.json:', todos);
    } catch (parseError) {
      console.error('Error parsing todos.json:', parseError);
    }
  }
});

// Create a new to-do item
app.post('/todos', (req, res) => {
  const { task } = req.body;
  const newTodo = { id: Date.now(), task, completed: false };
  todos.push(newTodo);

  // Save the updated data to todos.json
  fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
    if (err) {
      console.error('Error writing todos.json:', err);
    } else {
      console.log('Data saved to todos.json:', todos);
    }
  });

  res.json(newTodo);
});

// Retrieve all to-do items
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Update a to-do item's completion status
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTodo = todos.find((todo) => todo.id === id);
  if (!updatedTodo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  updatedTodo.completed = true;

  // Save the updated data to todos.json
  fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
    if (err) {
      console.error('Error writing todos.json:', err);
    } else {
      console.log('Data saved to todos.json:', todos);
    }
  });

  res.json(updatedTodo);
});

// Delete a to-do item
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter((todo) => todo.id !== id);

  // Save the updated data to todos.json
  fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), (err) => {
    if (err) {
      console.error('Error writing todos.json:', err);
    } else {
      console.log('Data saved to todos.json:', todos);
    }
  });

  res.json({ message: 'Todo deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
