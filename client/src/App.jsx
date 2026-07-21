import React, { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Add new task
  const handleAddTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
      }
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  // Update task
  const handleUpdateTask = async (id, taskData) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      })
      if (response.ok) {
        const updatedTask = await response.json()
        setTasks(tasks.map(t => t.id === id ? updatedTask : t))
        setEditingId(null)
        setEditingTask(null)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Delete task
  const handleDeleteTask = async (id) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setTasks(tasks.filter(t => t.id !== id))
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  // Start editing
  const handleEditTask = (task) => {
    setEditingId(task.id)
    setEditingTask(task)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTask(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>📋 Task Tracker</h1>
        <p>Keep track of your tasks with due dates</p>
      </header>

      <main className="app-main">
        <div className="form-section">
          <TaskForm
            onSubmit={editingId ? 
              (data) => handleUpdateTask(editingId, data) : 
              handleAddTask
            }
            initialData={editingTask}
            isEditing={editingId !== null}
            onCancel={handleCancelEdit}
          />
        </div>

        <div className="tasks-section">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
