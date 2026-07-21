import React, { useState, useEffect } from 'react'
import './TaskForm.css'

function TaskForm({ onSubmit, initialData, isEditing, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  })

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        dueDate: initialData.dueDate || '',
        priority: initialData.priority || 'medium'
      })
    }
  }, [initialData, isEditing])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      alert('Please enter a task title')
      return
    }
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium'
    })
    onCancel()
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>

      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          maxLength="100"
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add details about the task"
          rows="3"
          maxLength="500"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dueDate">Due Date</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
