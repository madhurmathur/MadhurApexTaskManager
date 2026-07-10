import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, Category, ViewType, FilterType, SortKeyType, SortDirectionType } from '../types';
import confetti from 'canvas-confetti';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  selectedCategory: string | null;
  selectedFilter: FilterType;
  activeView: ViewType;
  searchQuery: string;
  sortKey: SortKeyType;
  sortDirection: SortDirectionType;
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedFilter: (filter: FilterType) => void;
  setActiveView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  setSortKey: (key: SortKeyType) => void;
  setSortDirection: (dir: SortDirectionType) => void;
  toggleTheme: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#6366f1' },
  { id: '2', name: 'Personal', color: '#8b5cf6' },
  { id: '3', name: 'Shopping', color: '#10b981' },
  { id: '4', name: 'Health', color: '#f59e0b' },
  { id: '5', name: 'Finance', color: '#ef4444' }
];

const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Design ApexTask UI system',
    description: 'Create modern custom CSS properties for dark/light themes, typography, and beautiful cards.',
    dueDate: getTodayString(0),
    priority: 'high',
    status: 'completed',
    category: 'Work',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    subtasks: [
      { id: 's1', title: 'Define color variables', isCompleted: true },
      { id: 's2', title: 'Design Glassmorphism rules', isCompleted: true },
      { id: 's3', title: 'Create responsive grid rules', isCompleted: true }
    ]
  },
  {
    id: 't2',
    title: 'Implement Kanban Board View',
    description: 'Set up columns and code HTML5 native drag & drop support to change task state dynamically.',
    dueDate: getTodayString(1),
    priority: 'high',
    status: 'in_progress',
    category: 'Work',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: [
      { id: 's4', title: 'Design board column layout', isCompleted: true },
      { id: 's5', title: 'Implement drag start and drag end handlers', isCompleted: false },
      { id: 's6', title: 'Implement drop and update handlers', isCompleted: false }
    ]
  },
  {
    id: 't3',
    title: 'Weekly grocery shopping',
    description: 'Fresh vegetables, milk, eggs, bread, and healthy snacks for the upcoming week.',
    dueDate: getTodayString(0),
    priority: 'medium',
    status: 'todo',
    category: 'Shopping',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's7', title: 'Vegetables & fruits', isCompleted: false },
      { id: 's8', title: 'Oatmeal & Almond Milk', isCompleted: false }
    ]
  },
  {
    id: 't4',
    title: 'Evening 5K outdoor run',
    description: 'Jog through the park trail to maintain cardio conditioning. Target pace: 5:30/km.',
    dueDate: getTodayString(2),
    priority: 'low',
    status: 'todo',
    category: 'Health',
    createdAt: new Date().toISOString(),
    subtasks: []
  },
  {
    id: 't5',
    title: 'Review monthly budget',
    description: 'Check subscription renewals, savings targets, and categorize transactions in sheet.',
    dueDate: getTodayString(5),
    priority: 'medium',
    status: 'todo',
    category: 'Finance',
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 's9', title: 'Export bank statements', isCompleted: false },
      { id: 's10', title: 'Allocate savings bucket', isCompleted: false }
    ]
  }
];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage or use defaults
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('apextask_tasks');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('apextask_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKeyType>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('asc');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('apextask_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('apextask_sound');
    return saved ? JSON.parse(saved) : true;
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('apextask_theme', theme);
  }, [theme]);

  // Sync tasks to localstorage
  useEffect(() => {
    localStorage.setItem('apextask_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Sync categories to localstorage
  useEffect(() => {
    localStorage.setItem('apextask_categories', JSON.stringify(categories));
  }, [categories]);

  // Sync sound settings to localstorage
  useEffect(() => {
    localStorage.setItem('apextask_sound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Premium Synthesized sound effect
  const playCompletionSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Node creation
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Warm synth chord (E5 and G#5) sliding up to B5/E6
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc1.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.12); // B5
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, ctx.currentTime); // G#5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15); // E6
      
      // Envelopes
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05); // quick attack
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5); // smooth decay
      
      osc1.start(ctx.currentTime);
      osc2.start(ctx.currentTime);
      
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  };

  // Actions
  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [task, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updated = { ...task, ...updates };
          // Play celebration sound and confetti if status changed to completed
          if (updates.status === 'completed' && task.status !== 'completed') {
            playCompletionSound();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
            });
          }
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(sub =>
            sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
          );
          
          // Check if all subtasks are now completed, and if task is not already completed, we can suggest completion
          const allCompletedNow = updatedSubtasks.length > 0 && updatedSubtasks.every(sub => sub.isCompleted);
          const wasCompleted = task.status === 'completed';
          
          let newStatus = task.status;
          if (allCompletedNow && !wasCompleted) {
            newStatus = 'completed';
            playCompletionSound();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']
            });
          } else if (!allCompletedNow && wasCompleted) {
            newStatus = 'in_progress';
          }

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: newStatus
          };
        }
        return task;
      })
    );
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addCategory = (name: string, color: string) => {
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) return;
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name,
      color
    };
    setCategories(prev => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    if (!categoryToDelete) return;
    
    // Remove category
    setCategories(prev => prev.filter(cat => cat.id !== id));
    
    // Reset tasks categorized with this category to default Work
    setTasks(prev =>
      prev.map(task =>
        task.category === categoryToDelete.name ? { ...task, category: 'Work' } : task
      )
    );

    if (selectedCategory === categoryToDelete.name) {
      setSelectedCategory(null);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        selectedCategory,
        selectedFilter,
        activeView,
        searchQuery,
        sortKey,
        sortDirection,
        theme,
        soundEnabled,
        addTask,
        updateTask,
        deleteTask,
        toggleSubtask,
        setSelectedCategory,
        setSelectedFilter,
        setActiveView,
        setSearchQuery,
        setSortKey,
        setSortDirection,
        toggleTheme,
        setSoundEnabled,
        addCategory,
        deleteCategory
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
