import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Menu } from 'lucide-react';
import { Todo, TodoGroup } from '../../features/todos/types/todo';
import TodoItem from './TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
import Dropdown from '../common/Dropdown';
import { SortField, SortDirection, sortOptions, sortItems } from '../../features/todos/utils/sortUtils';

interface ToDoListProps {
  group: TodoGroup;
  onCreateTask: (groupName: string) => void;
  onDeleteGroup: (groupName: string) => void;
}

const ToDoList: React.FC<ToDoListProps> = ({ group, onCreateTask, onDeleteGroup }) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedItems = sortItems(group.items, sortField, sortDirection);

  const handleDeleteGroup = () => {
    onDeleteGroup(group.name);
  };

  const groupOptions = [
    {
      value: 'add',
      label: 'Add Task',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      value: 'delete',
      label: 'Delete Group',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  const handleGroupAction = (value: string) => {
    if (value === 'add') {
      onCreateTask(group.name);
    } else if (value === 'delete') {
      handleDeleteGroup();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col [@media(min-width:460px)]:flex-row [@media(min-width:460px)]:items-center gap-2 [@media(min-width:460px)]:gap-5">
          <h2 className="text-xl font-semibold text-gray-800">{group.name}</h2>
          <div className="flex items-center gap-1">
            <Dropdown
              options={sortOptions}
              onChange={(value) => setSortField(value as SortField)}
              variant="menu"
              position="left"
              trigger={
                <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                  Sort by: {sortOptions.find(opt => opt.value === sortField)?.label}
                </button>
              }
              menuClassName="w-40"
            />
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Toggle sort direction"
            >
              {sortDirection === 'asc' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <Dropdown
          options={groupOptions}
          onChange={handleGroupAction}
          variant="menu"
          position="right"
          trigger={
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          }
          menuClassName="w-48"
        />
      </div>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {sortedItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
              style={{ marginTop: 0 }}
            >
              <div className="py-[6px]">
                <TodoItem todo={item} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {group.items.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No tasks available
          </p>
        )}
      </div>
    </div>
  );
};

export default ToDoList; 