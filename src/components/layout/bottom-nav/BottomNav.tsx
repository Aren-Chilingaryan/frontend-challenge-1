import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { groupFilterAtom, filterAtom } from '../../../features/todos/store/todoAtoms';
import { TodoGroup } from '../../../features/todos/types/todo';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomNavProps {
  onCreateTask: () => void;
  groups: TodoGroup[];
}

function BottomNav({ onCreateTask, groups }: BottomNavProps) {
  const [selectedGroup, setSelectedGroup] = useAtom(groupFilterAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsPanelOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group.toLowerCase());
    setIsPanelOpen(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.checked ? 'active' : 'all');
  };

  return (
    <>
      <div 
        className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 z-40"
        style={{
          backgroundColor: '#FFFFFF',
          transition: 'background-color 1s ease-in-out'
        }}
      >
        <div className="flex justify-around items-center h-16">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="flex flex-col items-center justify-center w-1/2 h-full transition-all duration-500 ease-in-out !outline-none !ring-0 !border-0 !bg-transparent text-blue-500"
            style={{ outline: 'none !important', background: 'transparent', WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs mt-1">Filter & Groups</span>
          </button>

          <button
            onClick={onCreateTask}
            className="flex flex-col items-center justify-center w-1/2 h-full text-blue-500 transition-all duration-500 ease-in-out !outline-none !ring-0 !border-0 !bg-transparent"
            style={{ outline: 'none !important', WebkitTapHighlightColor: 'transparent' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs mt-1">Create</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            ref={panelRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30 shadow-lg"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Tasks</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="activeOnly"
                    checked={filter === 'active'}
                    onChange={handleFilterChange}
                    className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <label htmlFor="activeOnly" className="text-sm text-gray-700">
                    Show only active tasks
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Groups</h3>
                <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                  <button
                    onClick={() => handleGroupSelect('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      selectedGroup === 'all' ? 'bg-blue-50 text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    All Tasks
                  </button>
                  {groups.map(group => (
                    <button
                      key={group.name}
                      onClick={() => handleGroupSelect(group.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedGroup === group.name.toLowerCase() ? 'bg-blue-50 text-blue-500' : 'text-gray-700'
                      }`}
                    >
                      {group.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BottomNav; 