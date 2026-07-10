import React from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task, SortKeyType } from '../types';
import { 
  Calendar, 
  Trash2, 
  Edit, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

interface ListViewProps {
  onEditTaskClick: (task: Task) => void;
}

const PRIORITY_VALUES = {
  high: 3,
  medium: 2,
  low: 1
};

export const ListView: React.FC<ListViewProps> = ({ onEditTaskClick }) => {
  const {
    tasks,
    selectedCategory,
    selectedFilter,
    searchQuery,
    sortKey,
    sortDirection,
    categories,
    setSortKey,
    setSortDirection,
    updateTask,
    deleteTask
  } = useTasks();

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const today = getTodayString();

  // Filter tasks
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (selectedCategory && task.category !== selectedCategory) {
        return false;
      }
      if (selectedFilter === 'today' && task.dueDate !== today) {
        return false;
      }
      if (selectedFilter === 'scheduled' && !task.dueDate) {
        return false;
      }
      if (selectedFilter === 'important' && task.priority !== 'high') {
        return false;
      }
      if (selectedFilter === 'completed' && task.status !== 'completed') {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      }
      return true;
    });
  };

  // Sort tasks
  const getSortedTasks = (items: Task[]) => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortKey === 'priority') {
        comparison = PRIORITY_VALUES[b.priority] - PRIORITY_VALUES[a.priority];
      } else if (sortKey === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortKey === 'createdAt') {
        comparison = a.createdAt.localeCompare(b.createdAt);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  };

  const filteredTasks = getFilteredTasks();
  const sortedTasks = getSortedTasks(filteredTasks);

  const toggleSort = (key: SortKeyType) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: SortKeyType) => {
    if (sortKey !== key) return <ArrowUpDown size={14} style={{ opacity: 0.5 }} />;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    updateTask(taskId, { status });
  };

  const getCategoryColor = (catName: string) => {
    const cat = categories.find(c => c.name === catName);
    return cat ? cat.color : '#94a3b8';
  };

  return (
    <div className="list-view-container">
      {/* Controls Bar */}
      <div className="list-controls">
        <h3 style={{ fontSize: '1.25rem' }}>
          {selectedFilter === 'all' && !selectedCategory ? 'All Tasks' : selectedCategory ? `Category: ${selectedCategory}` : `Filter: ${selectedFilter}`}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem', fontWeight: 'normal' }}>
            ({sortedTasks.length} task{sortedTasks.length === 1 ? '' : 's'} found)
          </span>
        </h3>

        {/* Sorting Dropdowns/Selectors */}
        <div className="list-sort-controls">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Sort by:</span>
          <select 
            className="list-sort-select" 
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value as SortKeyType)}
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
            <option value="createdAt">Date Created</option>
          </select>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem' }}
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>
        </div>
      </div>

      {/* Table Wrapper */}
      {sortedTasks.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-tertiary)' }}
        >
          No tasks match the active filters or search terms. Try clearing filters or creating a new task.
        </div>
      ) : (
        <div className="list-table-wrapper">
          <table className="list-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>Done</th>
                <th onClick={() => toggleSort('title')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Title & Description {getSortIcon('title')}
                  </div>
                </th>
                <th>Category</th>
                <th onClick={() => toggleSort('dueDate')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Due Date {getSortIcon('dueDate')}
                  </div>
                </th>
                <th onClick={() => toggleSort('priority')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    Priority {getSortIcon('priority')}
                  </div>
                </th>
                <th>Status</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map(task => {
                const isCompleted = task.status === 'completed';
                const isOverdue = task.dueDate && task.dueDate < today && !isCompleted;
                const isToday = task.dueDate === today && !isCompleted;
                const color = getCategoryColor(task.category);

                return (
                  <tr key={task.id} style={{ opacity: isCompleted ? 0.75 : 1 }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        className="list-table-checkbox"
                        checked={isCompleted}
                        onChange={() => handleStatusChange(task.id, isCompleted ? 'todo' : 'completed')}
                      />
                    </td>
                    <td>
                      <div>
                        <span 
                          style={{ 
                            fontWeight: 600, 
                            textDecoration: isCompleted ? 'line-through' : 'none',
                            color: isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)',
                            fontSize: '0.95rem'
                          }}
                        >
                          {task.title}
                        </span>
                        {task.description && (
                          <div 
                            style={{ 
                              fontSize: '0.8rem', 
                              color: 'var(--text-secondary)',
                              marginTop: '0.2rem',
                              maxWidth: '350px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {task.description}
                          </div>
                        )}
                        {task.subtasks.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--color-success)' }}>
                            <span>
                              Subtasks: {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span 
                        className="badge" 
                        style={{ 
                          backgroundColor: `${color}15`, 
                          color: color, 
                          border: `1px solid ${color}30` 
                        }}
                      >
                        {task.category}
                      </span>
                    </td>
                    <td>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          fontSize: '0.8rem',
                          color: isOverdue ? 'var(--color-danger)' : isToday ? 'var(--color-warning)' : 'var(--text-secondary)',
                          fontWeight: isOverdue || isToday ? 'bold' : 'normal'
                        }}
                      >
                        <Calendar size={13} />
                        <span>{task.dueDate ? task.dueDate : 'No due date'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${task.priority}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <select
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', width: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => onEditTaskClick(task)}
                          title="Edit Task"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => deleteTask(task.id)}
                          title="Delete Task"
                        >
                          <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
