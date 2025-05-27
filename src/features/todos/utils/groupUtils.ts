import { Todo, TodoGroup } from '../types/todo';

export const groupTodos = (todos: Todo[]): TodoGroup[] => {
  const allGroupNames = new Set(todos.map(todo => todo.group || 'No Group'));

  const grouped = todos.reduce((groups, todo) => {
    const groupName = todo.group || 'No Group';
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        items: []
      };
    }
    groups[groupName].items.push(todo);
    return groups;
  }, {} as Record<string, TodoGroup>);

  allGroupNames.forEach(groupName => {
    if (!grouped[groupName]) {
      grouped[groupName] = {
        name: groupName,
        items: []
      };
    }
  });

  return Object.values(grouped).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
}; 