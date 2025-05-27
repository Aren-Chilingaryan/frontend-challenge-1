import { useMemo } from 'react';
import { Todo } from '../types/todo';
import { groupTodos } from '../utils/groupUtils';

export const useGroupedTodos = (todos: Todo[]) => {
  return useMemo(() => {
    return groupTodos(todos);
  }, [todos]);
}; 