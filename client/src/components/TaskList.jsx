import React from 'react'
import TaskCard from './TaskCard'
import './TaskList.css'

function TaskList({ tasks, onDelete, onEdit }) {
  // Separate tasks by status
  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="task-list-container">
      <div className="task-list-section">
        <h2 className="section-title">
          📝 Active Tasks ({pendingTasks.length})
        </h2>
        {pendingTasks.length === 0 ? (
          <p className="empty-message">No active tasks</p>
        ) : (
          <div className="task-list">
            {pendingTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="task-list-section">
          <h2 className="section-title">
            ✅ Completed Tasks ({completedTasks.length})
          </h2>
          <div className="task-list completed">
            {completedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskList
