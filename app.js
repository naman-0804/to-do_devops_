const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// In-memory storage for todos
let todos = [
  { id: 1, task: "Learn Docker", completed: false, createdAt: new Date().toISOString() },
  { id: 2, task: "Set up CI/CD", completed: false, createdAt: new Date().toISOString() },
  { id: 3, task: "Deploy to production", completed: true, createdAt: new Date().toISOString() }
];

let nextId = 4;

// Helper function to parse request body
function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      callback(null, body ? JSON.parse(body) : {});
    } catch (error) {
      callback(error, null);
    }
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${method} ${pathname}`);
  
  // Serve React frontend
  if (pathname === '/' || pathname === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) {
        console.error('Error reading index.html:', err);
        res.writeHead(500);
        res.end('Error loading page');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  }
  
  // API Routes
  else if (pathname === '/api/todos' && method === 'GET') {
    sendJSON(res, 200, { success: true, data: todos });
  }
  
  else if (pathname === '/api/todos' && method === 'POST') {
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
        return;
      }
      
      const { task } = body;
      if (!task || task.trim().length === 0) {
        sendJSON(res, 400, { success: false, error: 'Task is required' });
        return;
      }
      
      const newTodo = {
        id: nextId++,
        task: task.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      todos.push(newTodo);
      sendJSON(res, 201, { success: true, data: newTodo });
    });
  }
  
  else if (pathname.startsWith('/api/todos/') && method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      sendJSON(res, 404, { success: false, error: 'Todo not found' });
      return;
    }
    
    parseBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
        return;
      }
      
      const { task, completed } = body;
      if (task !== undefined) todos[todoIndex].task = task.trim();
      if (completed !== undefined) todos[todoIndex].completed = completed;
      
      sendJSON(res, 200, { success: true, data: todos[todoIndex] });
    });
  }
  
  else if (pathname.startsWith('/api/todos/') && method === 'DELETE') {
    const id = parseInt(pathname.split('/')[3]);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
      sendJSON(res, 404, { success: false, error: 'Todo not found' });
      return;
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    sendJSON(res, 200, { success: true, data: deletedTodo });
  }
  
  // 404 for unknown routes
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Route not found' }));
  }
});

server.listen(3000, () => {
  console.log('Todo App with API running on port 3000');
});
