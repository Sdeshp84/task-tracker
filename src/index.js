import { Router } from 'itty-router';

const router = Router();

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
router.options('*', () => {
  return new Response(null, { headers: corsHeaders });
});

// GET all tasks
router.get('/api/tasks', async (request, { env }) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tasks ORDER BY dueDate ASC, createdAt DESC'
    ).all();
    
    return new Response(JSON.stringify(results || []), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// GET single task
router.get('/api/tasks/:id', async (request, { env, params }) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM tasks WHERE id = ?'
    ).bind(params.id).all();
    
    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response(JSON.stringify(results[0]), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// CREATE task
router.post('/api/tasks', async (request, { env }) => {
  try {
    const { title, description, dueDate, priority } = await request.json();
    
    if (!title) {
      return new Response(JSON.stringify({ error: 'Title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    const createdAt = new Date().toISOString();
    
    const stmt = env.DB.prepare(
      'INSERT INTO tasks (title, description, dueDate, status, priority, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      title,
      description || null,
      dueDate || null,
      'pending',
      priority || 'medium',
      createdAt,
      createdAt
    );
    
    const result = await stmt.run();
    
    return new Response(JSON.stringify({
      id: result.meta.last_row_id,
      title,
      description: description || null,
      dueDate: dueDate || null,
      status: 'pending',
      priority: priority || 'medium',
      createdAt,
      updatedAt: createdAt
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// UPDATE task
router.put('/api/tasks/:id', async (request, { env, params }) => {
  try {
    const { title, description, dueDate, status, priority } = await request.json();
    const updatedAt = new Date().toISOString();
    
    const stmt = env.DB.prepare(
      'UPDATE tasks SET title = ?, description = ?, dueDate = ?, status = ?, priority = ?, updatedAt = ? WHERE id = ?'
    ).bind(
      title,
      description || null,
      dueDate || null,
      status || 'pending',
      priority || 'medium',
      updatedAt,
      params.id
    );
    
    const result = await stmt.run();
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response(JSON.stringify({
      id: parseInt(params.id),
      title,
      description: description || null,
      dueDate: dueDate || null,
      status: status || 'pending',
      priority: priority || 'medium',
      updatedAt
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// DELETE task
router.delete('/api/tasks/:id', async (request, { env, params }) => {
  try {
    const stmt = env.DB.prepare(
      'DELETE FROM tasks WHERE id = ?'
    ).bind(params.id);
    
    const result = await stmt.run();
    
    if (result.meta.changes === 0) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    
    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
});

export default {
  fetch: router.handle,
};
