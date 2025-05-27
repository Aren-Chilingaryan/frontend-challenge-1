export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string;
  dueDate?: Date;
  createdAt: Date;
  lastModified: Date;
  isEditing: boolean;
  group: string;
}

export interface TodoGroup {
  name: string;
  items: Todo[];
} 