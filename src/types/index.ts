export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  category: string; // references Category.name or standard default names
  subtasks: SubTask[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // hex color or standard variables
}

export type ViewType = 'dashboard' | 'board' | 'list';
export type FilterType = 'all' | 'today' | 'scheduled' | 'important' | 'completed';
export type SortKeyType = 'dueDate' | 'priority' | 'title' | 'createdAt';
export type SortDirectionType = 'asc' | 'desc';
