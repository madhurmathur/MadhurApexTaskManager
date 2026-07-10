import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { KanbanBoardView } from './components/KanbanBoardView';
import { ListView } from './components/ListView';
import { TaskModal } from './components/TaskModal';
import type { Task } from './types';

// Importing CSS styles
import './styles/global.css';

const AppContent: React.FC = () => {
  const { activeView } = useTasks();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleAddTaskClick = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            onTaskClick={handleEditTask} 
            onAddTaskClick={handleAddTaskClick} 
          />
        );
      case 'board':
        return (
          <KanbanBoardView 
            onEditTaskClick={handleEditTask} 
          />
        );
      case 'list':
        return (
          <ListView 
            onEditTaskClick={handleEditTask} 
          />
        );
      default:
        return (
          <DashboardView 
            onTaskClick={handleEditTask} 
            onAddTaskClick={handleAddTaskClick} 
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Mobile sidebar overlay background */}
      {mobileSidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 45,
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={mobileSidebarOpen} 
        setIsOpen={setMobileSidebarOpen} 
      />

      <Header 
        onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
        onAddTaskClick={handleAddTaskClick}
      />

      <main className="main-content">
        {renderActiveView()}
      </main>

      {isModalOpen && (
        <TaskModal 
          taskToEdit={taskToEdit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
};

export default App;
