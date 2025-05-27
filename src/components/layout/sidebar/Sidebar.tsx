import React from 'react';
import { useAtom } from 'jotai';
import SidebarNavItem from './SidebarNavItem';
import { groupFilterAtom, filterAtom } from '../../../features/todos/store/todoAtoms';
import { TodoGroup } from '../../../features/todos/types/todo';

interface TodoSidebarProps {
  onCreateTask: () => void;
  groups: TodoGroup[];
}

function TodoSidebar({ onCreateTask, groups }: TodoSidebarProps) {
  const [selectedGroup, setSelectedGroup] = useAtom(groupFilterAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group.toLowerCase());
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.checked ? 'active' : 'all');
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 lg:p-4">
        <h1 className="text-lg lg:text-xl font-bold text-gray-800 mb-4 lg:mb-6">
          Todo App
        </h1>
        
        <button 
          onClick={onCreateTask}
          className="w-full bg-blue-500 text-white py-2 px-3 lg:px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4 lg:mb-6 text-sm lg:text-base"
        >
          Create Task
        </button>

        <div className="space-y-3 lg:space-y-4">
          <div>
            <h2 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">Filters</h2>
            <div className="flex items-center space-x-2 mb-3 lg:mb-4">
              <input
                type="checkbox"
                id="activeOnly"
                checked={filter === 'active'}
                onChange={handleFilterChange}
                className="h-3.5 lg:h-4 w-3.5 lg:w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="activeOnly" className="text-xs lg:text-sm text-gray-700">
                Show only active tasks
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-xs lg:text-sm font-semibold text-gray-600 mb-2">Groups</h2>
            <SidebarNavItem 
              label="All Tasks" 
              isActive={selectedGroup === 'all'}
              onClick={() => handleGroupSelect('all')}
            />
            <SidebarNavItem 
              label="Groups" 
              isExpandable={true}
              secondaryOptions={groups.map(group => ({
                label: group.name,
                isActive: selectedGroup === group.name.toLowerCase(),
                onClick: () => handleGroupSelect(group.name)
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoSidebar; 