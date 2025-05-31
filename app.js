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
      console.error('JSON Parse Error:', error);
      callback(error, null);
    }
  });
  req.on('error', (error) => {
    console.error('Request Error:', error);
    callback(error, null);
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  try {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error('Response Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
  }
}

const server = http.createServer((req, res) => {
  try {
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
    
    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);
    
    // Serve React frontend
    if (pathname === '/' || pathname === '/index.html') {
      const filePath = path.join(__dirname, 'Public', 'index.html');
      fs.readFile(filePath, (err, content) => {
        if (err) {
          console.error('Error reading index.html:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
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
    
    // Health check endpoint
    else if (pathname === '/health' && method === 'GET') {
      sendJSON(res, 200, { success: true, status: 'healthy', timestamp: new Date().toISOString() });
    }
    
    // 404 for unknown routes
    else {
      sendJSON(res, 404, { success: false, error: 'Route not found' });
    }
    
  } catch (error) {
    console.error('Server Error:', error);
    try {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
    } catch (responseError) {
      console.error('Response Error:', responseError);
      res.end();
    }
  }
});

server.on('error', (error) => {
  console.error('Server startup error:', error);
});

server.listen(3000, () => {
  console.log(`Todo App with API running on port 3000 at ${new Date().toISOString()}`);
});
