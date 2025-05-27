import { atom } from 'jotai';
import { Todo, TodoGroup } from '../types/todo';

// Load data from localStorage or use mock data if none exists
const loadDataFromStorage = (): TodoGroup[] => {
  const storedData = localStorage.getItem('todoData');
  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      // Convert string dates back to Date objects
      return parsedData.groups.map((group: TodoGroup) => ({
        ...group,
        items: group.items.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          lastModified: new Date(todo.lastModified),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }))
      }));
    } catch (error) {
      console.error('Error parsing data from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Save data to localStorage
const saveDataToStorage = (groups: TodoGroup[]) => {
  localStorage.setItem('todoData', JSON.stringify({ groups }));
};

// Initialize data from localStorage or mock data
const initialGroups = loadDataFromStorage();

// Main atoms
export const groupsAtom = atom<TodoGroup[]>(initialGroups);

// Filter atoms
export const filterAtom = atom<'all' | 'active' | 'completed'>('all');
export const searchAtom = atom('');
export const priorityFilterAtom = atom<'all' | 'low' | 'medium' | 'high'>('all');
export const groupFilterAtom = atom<string>('all');

// UI state atoms
export const selectedTodoAtom = atom<Todo | null>(null);
export const isModalOpenAtom = atom(false);
export const notificationAtom = atom<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

// Enhanced todo actions
export const addTodoAtom = atom(
  null,
  (get, set, todo: Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'isEditing'>) => {
    const groups = get(groupsAtom);
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      lastModified: new Date(),
      isEditing: false,
    };

    const updatedGroups = groups.map(group => {
      if (group.name === todo.group) {
        return {
          ...group,
          items: [...group.items, newTodo]
        };
      }
      return group;
    });

    // If group doesn't exist, create it
    if (!groups.some(g => g.name === todo.group)) {
      updatedGroups.push({
        name: todo.group,
        items: [newTodo]
      });
    }

    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
    set(notificationAtom, { message: 'Task added successfully!', type: 'success' });
  }
);

export const updateTodoAtom = atom(
  null,
  (get, set, { id, updates }: { id: string; updates: Partial<Todo> }) => {
    const groups = get(groupsAtom);
    const updatedGroups = groups.map(group => ({
      ...group,
      items: group.items.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, lastModified: new Date() }
          : todo
      )
    }));
    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
    set(notificationAtom, { message: 'Task updated successfully!', type: 'success' });
  }
);

export const toggleTodoAtom = atom(
  null,
  (get, set, id: string) => {
    const groups = get(groupsAtom);
    const updatedGroups = groups.map(group => ({
      ...group,
      items: group.items.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, lastModified: new Date() }
          : todo
      )
    }));
    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
  }
);

export const deleteTodoAtom = atom(
  null,
  (get, set, id: string) => {
    const groups = get(groupsAtom);
    const updatedGroups = groups.map(group => ({
      ...group,
      items: group.items.filter(todo => todo.id !== id)
    })).filter(group => group.items.length > 0); // Remove empty groups
    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
    set(notificationAtom, { message: 'Task deleted successfully!', type: 'success' });
  }
);

export const addGroupAtom = atom(
  null,
  (get, set, groupName: string) => {
    const groups = get(groupsAtom);
    const newGroup: TodoGroup = {
      name: groupName,
      items: []
    };
    const updatedGroups = [...groups, newGroup];
    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
    set(notificationAtom, { message: 'Group added successfully!', type: 'success' });
  }
);

export const deleteGroupAtom = atom(
  null,
  (get, set, groupName: string) => {
    const groups = get(groupsAtom);
    const updatedGroups = groups.filter(group => group.name !== groupName);
    set(groupsAtom, updatedGroups);
    saveDataToStorage(updatedGroups);
    set(notificationAtom, { message: 'Group deleted successfully!', type: 'success' });
  }
);

export const filteredTodosAtom = atom((get) => {
  const groups = get(groupsAtom);
  const filter = get(filterAtom);
  const search = get(searchAtom).toLowerCase();
  const priorityFilter = get(priorityFilterAtom);
  const groupFilter = get(groupFilterAtom);

  return groups.flatMap(group => {
    if (groupFilter !== 'all' && group.name.toLowerCase() !== groupFilter) {
      return [];
    }

    const filteredItems = group.items.filter(todo => {
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && !todo.completed) ||
        (filter === 'completed' && todo.completed);
      if (!matchesFilter) return false;

      const matchesSearch = todo.text.toLowerCase().includes(search) ||
        todo.description?.toLowerCase().includes(search);
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });

    return filteredItems;
  });
});

export const checkOverdueTasksAtom = atom(
  null,
  (get, set) => {
    const groups = get(groupsAtom);
    const now = new Date();
    
    groups.forEach(group => {
      group.items.forEach(todo => {
        if (todo.dueDate && !todo.completed && todo.dueDate < now) {
          set(notificationAtom, {
            message: `Task "${todo.text}" is overdue!`,
            type: 'warning'
          });
        }
      });
    });
  }
); 