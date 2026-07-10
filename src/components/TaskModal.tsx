import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task, SubTask } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface TaskModalProps {
  taskToEdit?: Task | null;
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ taskToEdit, onClose }) => {
  const { categories, addTask, updateTask } = useTasks();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Work');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');

  // Subtasks building state
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate || '');
      setCategory(taskToEdit.category);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setSubtasks(taskToEdit.subtasks);
    } else {
      // Set defaults for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setCategory(categories[0]?.name || 'Work');
      setPriority('medium');
      setStatus('todo');
      setSubtasks([]);
    }
  }, [taskToEdit, categories]);

  const handleAddSubtask = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: SubTask = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: newSubtaskTitle.trim(),
      isCompleted: false
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(sub => sub.id !== id));
  };

  const handleToggleSubtaskLocal = (id: string) => {
    setSubtasks(subtasks.map(sub => 
      sub.id === id ? { ...sub, isCompleted: !sub.isCompleted } : sub
    ));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Check if subtasks are all completed to automatically set completed status
    let finalStatus = status;
    if (subtasks.length > 0 && subtasks.every(s => s.isCompleted) && status !== 'completed') {
      finalStatus = 'completed';
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      status: finalStatus,
      category,
      subtasks
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create Task'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                placeholder="Name your task..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={80}
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="desc">Description</label>
              <textarea
                id="desc"
                placeholder="What details should we keep in mind?"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Category & Due Date */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
            </div>

            {/* Priority Selector */}
            <div className="form-group">
              <label>Priority</label>
              <div className="form-priority-options">
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'low' ? 'selected-low' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'medium' ? 'selected-medium' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`priority-option-btn ${priority === 'high' ? 'selected-high' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </button>
              </div>
            </div>

            {/* Status Selector */}
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={e => setStatus(e.target.value as Task['status'])}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Subtasks checklist section */}
            <div className="form-group">
              <label>Subtasks Checklist</label>
              <div className="checklist-builder">
                <div className="checklist-builder-input-row">
                  <input
                    type="text"
                    placeholder="Add subtask details..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubtask(e);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleAddSubtask}
                    style={{ padding: '0.65rem 1rem' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <div className="checklist-builder-list">
                    {subtasks.map(sub => (
                      <div key={sub.id} className="checklist-builder-item">
                        <div className="checklist-builder-item-left">
                          <input
                            type="checkbox"
                            checked={sub.isCompleted}
                            onChange={() => handleToggleSubtaskLocal(sub.id)}
                            style={{ width: '14px', height: '14px', accentColor: 'var(--color-success)', cursor: 'pointer' }}
                          />
                          <span style={{ textDecoration: sub.isCompleted ? 'line-through' : 'none', color: sub.isCompleted ? 'var(--text-tertiary)' : 'inherit' }}>
                            {sub.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ padding: '0.15rem' }}
                          onClick={() => handleRemoveSubtask(sub.id)}
                        >
                          <Trash2 size={14} style={{ color: 'var(--color-danger)' }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
