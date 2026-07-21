import React, { useState } from 'react'
import { Trash2, Edit2, CheckCircle2, Circle } from 'lucide-react'
import './TaskCard.css'

function TaskCard({ task, onDelete, onEdit }) {
  const [isCompleting, setIsCompleting] = useState(false)

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today && task.status === 'pending'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    today.setHours(0, 0, 0, 0)
    tomorrow.setHours(0, 0, 0, 0)
    const dueDate = new Date(dateString)
    dueDate.setHours(0, 0, 0, 0)

    if (dueDate.getTime() === today.getTime()) {
      return 'Today'
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow'
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#ef4444'
      case 'medium':
        return '#f59e0b'
      case 'low':
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: newStatus,
          priority: task.priority
        })
      })
      if (response.ok) {
        window.location.reload() // Refresh to update task lists
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const overdue = isOverdue()

  return (
    <div className={`task-card ${overdue ? 'overdue' : ''} ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-card-header">
        <div className="task-title-section">
          <button
            className="toggle-complete-btn"
            onClick={handleToggleComplete}
            disabled={isCompleting}
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as complete'}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 size={24} color="#10b981" />
            ) : (
              <Circle size={24} color="#ccc" />
            )}
          </button>
          <div className="task-title-info">
            <h3 className={`task-title ${task.status === 'completed' ? 'completed' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
        </div>
        <div className="task-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <Edit2 size={18} />
          </button>
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="task-footer">
        <div className="task-meta">
          <div
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
          <div className={`due-date ${overdue ? 'overdue-text' : ''}`}>
            📅 {formatDate(task.dueDate)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
