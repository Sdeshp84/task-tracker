import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
const dbPath = path.join(__dirname, 'tasks.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      dueDate TEXT,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Tasks table ready');
    }
  });
}

// API Routes

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY dueDate ASC, createdAt DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single task
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(row);
  });
});

// CREATE task
app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const createdAt = new Date().toISOString();
  
  db.run(
    'INSERT INTO tasks (title, description, dueDate, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description || null, dueDate || null, priority || 'medium', createdAt, createdAt],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: this.lastID,
        title,
        description: description || null,
        dueDate: dueDate || null,
        priority: priority || 'medium',
        status: 'pending',
        createdAt,
        updatedAt: createdAt
      });
    }
  );
});

// UPDATE task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, status, priority } = req.body;

  const updatedAt = new Date().toISOString();
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, dueDate = ?, status = ?, priority = ?, updatedAt = ? WHERE id = ?',
    [title, description || null, dueDate || null, status || 'pending', priority || 'medium', updatedAt, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json({
        id: parseInt(id),
        title,
        description: description || null,
        dueDate: dueDate || null,
        status: status || 'pending',
        priority: priority || 'medium',
        updatedAt
      });
    }
  );
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

// Serve static files
const clientBuildPath = path.join(__dirname, 'client', 'dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
