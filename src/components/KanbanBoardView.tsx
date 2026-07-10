import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardViewProps {
  onEditTaskClick: (task: Task) => void;
}

export const KanbanBoardView: React.FC<KanbanBoardViewProps> = ({ onEditTaskClick }) => {
  const {
    tasks,
    selectedCategory,
    selectedFilter,
    searchQuery,
    updateTask
  } = useTasks();

  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const getTodayString = () => new Date().toISOString().split('T')[0];
  const today = getTodayString();

  // Filter tasks based on search, category, and active filter
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // 1. Category Filter
      if (selectedCategory && task.category !== selectedCategory) {
        return false;
      }

      // 2. Sidebar Filters
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

      // 3. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        return matchesTitle || matchesDesc;
      }

      return true;
    });
  };

  const filteredTasks = getFilteredTasks();

  // Columns definition
  const columns = [
    { id: 'todo', title: 'To Do', colorClass: 'todo' },
    { id: 'in_progress', title: 'In Progress', colorClass: 'progress' },
    { id: 'completed', title: 'Completed', colorClass: 'completed' }
  ];

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTask(taskId, { status: columnId as Task['status'] });
    }
    setDragOverColumn(null);
  };

  return (
    <div className="kanban-board">
      {columns.map(col => {
        const colTasks = filteredTasks.filter(t => t.status === col.id);
        const isColumnDragOver = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`kanban-column ${isColumnDragOver ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="kanban-column-header">
              <div className="column-title-box">
                <span className={`column-dot ${col.colorClass}`} />
                <h3 className="column-title">{col.title}</h3>
              </div>
              <span className="column-count">{colTasks.length}</span>
            </div>

            <div className="kanban-cards-container">
              {colTasks.length === 0 ? (
                <div 
                  style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    border: '2px dashed var(--border-color)', 
                    borderRadius: 'var(--radius-md)',
                    padding: '2rem 1rem',
                    color: 'var(--text-tertiary)',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    minHeight: '120px'
                  }}
                >
                  Drag tasks here
                </div>
              ) : (
                colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEditClick={onEditTaskClick}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
