import { Todo } from '../types/todo';

export type SortField = 'priority' | 'createdAt' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export const sortOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Creation Date' },
  { value: 'dueDate', label: 'Due Date' },
];

export const sortItems = (items: Todo[], sortField: SortField, sortDirection: SortDirection): Todo[] => {
  return [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}; 