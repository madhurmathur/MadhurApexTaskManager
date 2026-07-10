import React from 'react';
import type { Task } from '../types';
import { useTasks } from '../context/TaskContext';
import { Calendar, CheckSquare, Edit, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEditClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEditClick }) => {
  const { categories, deleteTask, toggleSubtask } = useTasks();

  const currentCategoryObj = categories.find(cat => cat.name === task.category);
  const categoryColor = currentCategoryObj ? currentCategoryObj.color : '#94a3b8';

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const today = getTodayString();
  const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';
  const isToday = task.dueDate === today && task.status !== 'completed';

  // Subtask progress
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter(s => s.isCompleted).length;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Add opacity or styling for dragging card
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  return (
    <div
      className={`task-card ${task.status === 'completed' ? 'completed' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Category and Actions Header */}
      <div className="task-card-header">
        <span
          className="task-card-category"
          style={{
            backgroundColor: `${categoryColor}15`,
            color: categoryColor,
            border: `1px solid ${categoryColor}30`
          }}
        >
          {task.category}
        </span>
        <div className="task-card-actions">
          <button 
            className="btn-icon" 
            style={{ padding: '0.2rem' }} 
            onClick={() => onEditClick(task)}
            title="Edit Task"
          >
            <Edit size={14} />
          </button>
          <button 
            className="btn-icon" 
            style={{ padding: '0.2rem' }} 
            onClick={() => deleteTask(task.id)}
            title="Delete Task"
          >
            <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
          </button>
        </div>
      </div>

      {/* Task Details */}
      <div>
        <h4 className="task-card-title">{task.title}</h4>
        {task.description && (
          <p className="task-card-desc" style={{ marginTop: '0.35rem' }}>{task.description}</p>
        )}
      </div>

      {/* Checklist Progress */}
      {totalSubtasks > 0 && (
        <div className="task-card-checklist">
          <div className="checklist-bar-wrapper">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <CheckSquare size={12} />
              <span>Subtasks</span>
            </span>
            <span>{completedSubtasks}/{totalSubtasks} ({subtaskPercentage}%)</span>
          </div>
          <div className="checklist-progress-bg">
            <div 
              className="checklist-progress-fill" 
              style={{ width: `${subtaskPercentage}%` }}
            />
          </div>
          
          {/* Quick toggle subtasks dropdown or expandable (show inline for simplicity/interactivity) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.35rem' }}>
            {task.subtasks.map(sub => (
              <label 
                key={sub.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.75rem', 
                  cursor: 'pointer',
                  color: sub.isCompleted ? 'var(--text-tertiary)' : 'var(--text-secondary)'
                }}
              >
                <input
                  type="checkbox"
                  checked={sub.isCompleted}
                  onChange={() => toggleSubtask(task.id, sub.id)}
                  style={{ width: '13px', height: '13px', cursor: 'pointer', accentColor: 'var(--color-success)' }}
                />
                <span style={{ textDecoration: sub.isCompleted ? 'line-through' : 'none' }}>
                  {sub.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="task-card-footer">
        <div 
          className={`task-card-date ${isOverdue ? 'overdue' : isToday ? 'today' : ''}`}
        >
          <Calendar size={12} />
          <span>{task.dueDate ? task.dueDate : 'No due date'}</span>
        </div>
        <span 
          className={`badge badge-${task.priority}`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};
