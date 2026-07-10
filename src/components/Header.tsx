import React from 'react';
import { useTasks } from '../context/TaskContext';
import { Menu, Search, Plus } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onAddTaskClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onAddTaskClick }) => {
  const { searchQuery, setSearchQuery, tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle-btn btn-icon" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-right">
        {/* Quick Stats Dashboard */}
        <div className="quick-stats">
          <div className="stat-mini">
            <span className="stat-mini-value">{completedTasks}/{totalTasks}</span>
            <span className="stat-mini-label">Tasks Done</span>
          </div>
          <div className="header-divider" />
          <div className="stat-mini">
            <span className="stat-mini-value" style={{ color: 'var(--color-primary)' }}>{percentComplete}%</span>
            <span className="stat-mini-label">Progress</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onAddTaskClick}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
