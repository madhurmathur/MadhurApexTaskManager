import React from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  Calendar, 
  ChevronRight, 
  TrendingUp 
} from 'lucide-react';

interface DashboardViewProps {
  onTaskClick: (task: Task) => void;
  onAddTaskClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onTaskClick, onAddTaskClick }) => {
  const { tasks } = useTasks();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const today = getTodayString();

  // Metrics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progressCount = tasks.filter(t => t.status === 'in_progress').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  
  const overdueCount = tasks.filter(t => {
    return t.status !== 'completed' && t.dueDate && t.dueDate < today;
  }).length;

  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Priority calculations
  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium');
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low');

  const getPriorityPercent = (taskList: Task[]) => {
    return totalCount > 0 ? Math.round((taskList.length / totalCount) * 100) : 0;
  };

  // SVG Circular progress dimensions
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentComplete / 100) * circumference;

  // Upcoming Tasks (non-completed, sorted by nearest due date, limit to 4)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {totalCount === 0 
            ? "You don't have any tasks scheduled yet. Start by adding a task!" 
            : `You have completed ${completedCount} of your ${totalCount} tasks. Keep it up!`}
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="dashboard-grid">
        <div className="glass-panel dashboard-stat-card">
          <div className="stat-info">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <ListTodo size={24} />
          </div>
        </div>

        <div className="glass-panel dashboard-stat-card">
          <div className="stat-info">
            <span className="stat-number" style={{ color: 'var(--color-success)' }}>{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="glass-panel dashboard-stat-card">
          <div className="stat-info">
            <span className="stat-number" style={{ color: 'var(--color-secondary)' }}>{progressCount + todoCount}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="glass-panel dashboard-stat-card">
          <div className="stat-info">
            <span className="stat-number" style={{ color: 'var(--color-danger)' }}>{overdueCount}</span>
            <span className="stat-label">Overdue</span>
          </div>
          <div className="stat-icon-box" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Charts / Progress Indicators Section */}
      <div className="dashboard-main-row">
        {/* Radial progress card */}
        <div className="glass-panel radial-progress-card">
          <h3>Task Completion</h3>
          <div className="radial-progress-wrapper">
            <svg className="radial-svg" width="150" height="150">
              <circle className="radial-bg" cx="75" cy="75" r={radius} />
              <circle 
                className="radial-fill" 
                cx="75" 
                cy="75" 
                r={radius} 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="radial-percentage">
              <span>{percentComplete}%</span>
              <span className="radial-label">Finished</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-success)' }} />
            <span>Smooth sailing today!</span>
          </div>
        </div>

        {/* Priority breakdown card */}
        <div className="glass-panel priority-breakdown-card">
          <h3>Priority Breakdown</h3>
          <div className="priority-bars-container">
            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span style={{ fontWeight: 600 }}>High Priority</span>
                <span style={{ color: 'var(--color-danger)' }}>{highPriorityTasks.length} ({getPriorityPercent(highPriorityTasks)}%)</span>
              </div>
              <div className="priority-bar-bg">
                <div 
                  className="priority-bar-fill" 
                  style={{ width: `${getPriorityPercent(highPriorityTasks)}%`, backgroundColor: 'var(--color-danger)' }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span style={{ fontWeight: 600 }}>Medium Priority</span>
                <span style={{ color: 'var(--color-warning)' }}>{mediumPriorityTasks.length} ({getPriorityPercent(mediumPriorityTasks)}%)</span>
              </div>
              <div className="priority-bar-bg">
                <div 
                  className="priority-bar-fill" 
                  style={{ width: `${getPriorityPercent(mediumPriorityTasks)}%`, backgroundColor: 'var(--color-warning)' }}
                />
              </div>
            </div>

            <div className="priority-bar-item">
              <div className="priority-bar-header">
                <span style={{ fontWeight: 600 }}>Low Priority</span>
                <span style={{ color: 'var(--color-success)' }}>{lowPriorityTasks.length} ({getPriorityPercent(lowPriorityTasks)}%)</span>
              </div>
              <div className="priority-bar-bg">
                <div 
                  className="priority-bar-fill" 
                  style={{ width: `${getPriorityPercent(lowPriorityTasks)}%`, backgroundColor: 'var(--color-success)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming / Recent Tasks List */}
      <div className="dashboard-secondary-row">
        <div className="glass-panel upcoming-tasks-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Upcoming Focus</h3>
            {totalCount === 0 ? null : (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
                {upcomingTasks.length} urgent task{upcomingTasks.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          <div className="upcoming-tasks-list">
            {upcomingTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                  Hooray! No pending upcoming tasks.
                </span>
                <button className="btn btn-secondary" onClick={onAddTaskClick}>
                  Create a new Task
                </button>
              </div>
            ) : (
              upcomingTasks.map(task => {
                const isOverdue = task.dueDate && task.dueDate < today;
                const isToday = task.dueDate === today;
                
                return (
                  <div 
                    key={task.id} 
                    className="upcoming-task-item"
                    onClick={() => onTaskClick(task)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="upcoming-task-left">
                      <div 
                        className={`badge badge-${task.priority}`}
                        style={{ minWidth: '70px', justifyContent: 'center' }}
                      >
                        {task.priority}
                      </div>
                      <div className="upcoming-task-info">
                        <span className="upcoming-task-title">{task.title}</span>
                        <div className="upcoming-task-meta">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Calendar size={12} />
                            <span className={isOverdue ? 'overdue' : isToday ? 'today' : ''} style={{ color: isOverdue ? 'var(--color-danger)' : isToday ? 'var(--color-warning)' : 'inherit', fontWeight: isOverdue || isToday ? 'bold' : 'normal' }}>
                              {task.dueDate ? task.dueDate : 'No Date'}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{task.category}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} style={{ color: 'var(--text-tertiary)' }} />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
