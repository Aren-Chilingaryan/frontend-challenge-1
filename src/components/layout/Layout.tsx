import React, { useState } from 'react';
import { useAtom } from 'jotai';
import {
  filteredTodosAtom,
  checkOverdueTasksAtom,
  groupsAtom,
  deleteGroupAtom,
  groupFilterAtom,
  filterAtom
} from '../../features/todos/store/todoAtoms';
import Modal from '../common/Modal';
import TodoForm from '../todo/TodoForm';
import ToDoList from '../todo/ToDoList';
import TodoSidebar from './sidebar/Sidebar';
import BottomNav from './bottom-nav/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import EmptyState from '../todo/EmptyState';

function TodoLayout() {
  const [filteredTodos] = useAtom(filteredTodosAtom);
  const [groups] = useAtom(groupsAtom);
  const [, checkOverdueTasks] = useAtom(checkOverdueTasksAtom);
  const [, deleteGroup] = useAtom(deleteGroupAtom);
  const [selectedGroup] = useAtom(groupFilterAtom);
  const [filter] = useAtom(filterAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupToCreate, setGroupToCreate] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredGroups = groups.map(group => {
    if (filter === 'active') {
      return {
        ...group,
        items: group.items.filter(todo => !todo.completed)
      };
    }
    return group;
  });

  const displayGroups = selectedGroup === 'all' 
    ? filteredGroups
    : filteredGroups.filter(group => group.name.toLowerCase() === selectedGroup);

  const handleCreateTask = (groupName: string) => {
    setGroupToCreate(groupName);
    setIsModalOpen(true);
  };

  const handleDeleteGroup = (groupName: string) => {
    setGroupToDelete(groupName);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGroup = () => {
    setIsDeleting(true);
  };

  const handleAnimationComplete = () => {
    if (isDeleting) {
      deleteGroup(groupToDelete);
      setIsDeleteModalOpen(false);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block w-64 lg:w-72 bg-white shadow-lg h-screen fixed left-0 top-0 z-30">
        <TodoSidebar 
          onCreateTask={() => handleCreateTask('')} 
          groups={groups}
        />
      </div>

      <div className="flex-1 md:ml-64 lg:ml-72 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-8">
          {groups.length === 0 ? (
            <EmptyState onCreateTask={() => handleCreateTask('')} />
          ) : (
            <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
              {!isDeleting && (
                <motion.div
                  key={JSON.stringify(displayGroups.map(g => g.name))}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                      opacity: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
                    }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    transition: {
                      opacity: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                    }
                  }}
                >
                  <div className="space-y-6">
                    {displayGroups.map((group) => (
                      <ToDoList 
                        key={group.name}
                        group={group} 
                        onCreateTask={handleCreateTask}
                        onDeleteGroup={handleDeleteGroup}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <BottomNav 
        onCreateTask={() => handleCreateTask('')}
        groups={groups}
      />

      <Modal
       isOpen={isModalOpen}
       closeButton={true}
        onClose={() => {
        setIsModalOpen(false);
        setGroupToCreate('');
      }}>
        <TodoForm 
          onClose={() => {
            setIsModalOpen(false);
            setGroupToCreate('');
          }} 
          initialGroup={groupToCreate}
          existingGroups={groups.map(group => group.name)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Group</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the group <span className="font-semibold text-gray-900">{groupToDelete}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmDeleteGroup}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            >
              Delete Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TodoLayout; 