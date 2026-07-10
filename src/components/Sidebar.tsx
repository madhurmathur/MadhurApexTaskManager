import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { ViewType, FilterType } from '../types';
import { 
  LayoutDashboard, 
  Kanban, 
  ListTodo, 
  CheckSquare, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PRESET_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const {
    tasks,
    categories,
    selectedCategory,
    selectedFilter,
    activeView,
    theme,
    soundEnabled,
    setSelectedCategory,
    setSelectedFilter,
    setActiveView,
    toggleTheme,
    setSoundEnabled,
    addCategory,
    deleteCategory
  } = useTasks();

  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [showCatForm, setShowCatForm] = useState(false);

  // Helper to get today string format YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split('T')[0];

  // Helper to count tasks
  const getCounts = (filter: FilterType) => {
    const today = getTodayString();
    switch (filter) {
      case 'all':
        return tasks.length;
      case 'today':
        return tasks.filter(t => t.dueDate === today && t.status !== 'completed').length;
      case 'scheduled':
        return tasks.filter(t => t.dueDate && t.status !== 'completed').length;
      case 'important':
        return tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
      case 'completed':
        return tasks.filter(t => t.status === 'completed').length;
      default:
        return 0;
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), selectedColor);
    setNewCatName('');
    setShowCatForm(false);
  };

  const handleCategoryClick = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    // Switch to list view or board view when clicking category if we are on dashboard
    if (activeView === 'dashboard') {
      setActiveView('board');
    }
    // Close sidebar on mobile
    setIsOpen(false);
  };

  const handleFilterClick = (filter: FilterType) => {
    setSelectedFilter(filter);
    setSelectedCategory(null); // Clear category filter when clicking global filters
    if (activeView === 'dashboard') {
      setActiveView('board');
    }
    setIsOpen(false);
  };

  const handleViewClick = (view: ViewType) => {
    setActiveView(view);
    setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={20} />
        </div>
        <span className="logo-text">MadhurApexTaskManager</span>
      </div>

      <div className="sidebar-scrollable">
        {/* Navigation Section */}
        <div>
          <h3 className="sidebar-section-title">Views</h3>
          <ul className="sidebar-nav-list">
            <li 
              className={`sidebar-nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleViewClick('dashboard')}
            >
              <div className="sidebar-nav-item-left">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </li>
            <li 
              className={`sidebar-nav-item ${activeView === 'board' ? 'active' : ''}`}
              onClick={() => handleViewClick('board')}
            >
              <div className="sidebar-nav-item-left">
                <Kanban size={18} />
                <span>Kanban Board</span>
              </div>
            </li>
            <li 
              className={`sidebar-nav-item ${activeView === 'list' ? 'active' : ''}`}
              onClick={() => handleViewClick('list')}
            >
              <div className="sidebar-nav-item-left">
                <ListTodo size={18} />
                <span>Task List</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Filters Section */}
        <div>
          <h3 className="sidebar-section-title">Filters</h3>
          <ul className="sidebar-nav-list">
            <li 
              className={`sidebar-nav-item ${selectedFilter === 'all' && !selectedCategory ? 'active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              <div className="sidebar-nav-item-left">
                <CheckSquare size={16} />
                <span>All Tasks</span>
              </div>
              <span className="sidebar-nav-count">{getCounts('all')}</span>
            </li>
            <li 
              className={`sidebar-nav-item ${selectedFilter === 'today' ? 'active' : ''}`}
              onClick={() => handleFilterClick('today')}
            >
              <div className="sidebar-nav-item-left">
                <Calendar size={16} style={{ color: 'var(--color-warning)' }} />
                <span>Today</span>
              </div>
              <span className="sidebar-nav-count">{getCounts('today')}</span>
            </li>
            <li 
              className={`sidebar-nav-item ${selectedFilter === 'scheduled' ? 'active' : ''}`}
              onClick={() => handleFilterClick('scheduled')}
            >
              <div className="sidebar-nav-item-left">
                <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Scheduled</span>
              </div>
              <span className="sidebar-nav-count">{getCounts('scheduled')}</span>
            </li>
            <li 
              className={`sidebar-nav-item ${selectedFilter === 'important' ? 'active' : ''}`}
              onClick={() => handleFilterClick('important')}
            >
              <div className="sidebar-nav-item-left">
                <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />
                <span>Important</span>
              </div>
              <span className="sidebar-nav-count">{getCounts('important')}</span>
            </li>
            <li 
              className={`sidebar-nav-item ${selectedFilter === 'completed' ? 'active' : ''}`}
              onClick={() => handleFilterClick('completed')}
            >
              <div className="sidebar-nav-item-left">
                <CheckCircle2 size={16} style={{ color: 'var(--color-success)' }} />
                <span>Completed</span>
              </div>
              <span className="sidebar-nav-count">{getCounts('completed')}</span>
            </li>
          </ul>
        </div>

        {/* Categories Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h3 className="sidebar-section-title" style={{ margin: 0 }}>Categories</h3>
            <button 
              className="btn-icon" 
              style={{ padding: '0.12rem' }}
              onClick={() => setShowCatForm(!showCatForm)}
            >
              <Plus size={16} />
            </button>
          </div>

          <ul className="sidebar-nav-list">
            <li 
              className={`sidebar-nav-item ${selectedCategory === null && selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryClick(null)}
            >
              <div className="sidebar-nav-item-left">
                <span className="category-dot" style={{ backgroundColor: 'var(--text-tertiary)' }}></span>
                <span>All Categories</span>
              </div>
            </li>
            {categories.map(cat => (
              <li 
                key={cat.id}
                className={`sidebar-nav-item ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="sidebar-nav-item-left">
                  <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
                  <span>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="sidebar-nav-count" style={{ display: selectedCategory === cat.name ? 'none' : 'inline' }}>
                    {tasks.filter(t => t.category === cat.name).length}
                  </span>
                  {/* Default preset categories id 1-5 cannot be deleted to maintain schema consistency */}
                  {parseInt(cat.id) > 5 || isNaN(parseInt(cat.id)) ? (
                    <button 
                      className="category-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat.id);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          {showCatForm && (
            <form onSubmit={handleAddCategory} className="add-category-form">
              <input 
                type="text" 
                placeholder="New category..." 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                maxLength={15}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                autoFocus
              />
              <div className="add-category-colors">
                {PRESET_COLORS.map(c => (
                  <span 
                    key={c}
                    className={`color-select-dot ${selectedColor === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setSelectedColor(c)}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.4rem', flex: 1, fontSize: '0.75rem' }}>
                  Add
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem', flex: 1, fontSize: '0.75rem' }}
                  onClick={() => setShowCatForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Sidebar Footer / Quick Actions */}
      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--sidebar-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn-icon" 
          onClick={toggleTheme} 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button 
          className="btn-icon" 
          onClick={() => setSoundEnabled(!soundEnabled)} 
          title={soundEnabled ? "Mute completion sounds" : "Enable completion sounds"}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </div>
    </aside>
  );
};
