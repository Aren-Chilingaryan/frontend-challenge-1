import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Todo } from '../../features/todos/types/todo';
import { toggleTodoAtom, deleteTodoAtom, updateTodoAtom } from '../../features/todos/store/todoAtoms';
import Dropdown from '../common/Dropdown';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../common/Modal';
import TodoForm from './TodoForm';
import Button from '../common/Button';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [, toggleTodo] = useAtom(toggleTodoAtom);
  const [, deleteTodo] = useAtom(deleteTodoAtom);
  const [, updateTodo] = useAtom(updateTodoAtom);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (descriptionRef.current) {
        const element = descriptionRef.current;
        const isTextOverflowing = element.scrollHeight > element.clientHeight;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [todo.description]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const dropdownOptions = [
    {
      value: 'edit',
      label: 'Edit',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      value: 'delete',
      label: 'Delete',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  const handleDropdownChange = (value: string) => {
    if (value === 'edit') {
      handleEdit();
    } else if (value === 'delete') {
      setIsDeleteModalOpen(true);
    }
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTodo(todo.id);
      setIsDeleteModalOpen(false);
    }, 500);
  };

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <AnimatePresence>
        {!isDeleting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5 }
            }}
            className={
              `flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-10 p-3 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out relative ${todo.completed ? 'bg-gray-100 opacity-75' : 'bg-gray-50'
              }`
            }
          >
            <div className="absolute top-3 right-3">
              <Dropdown
                options={dropdownOptions}
                onChange={handleDropdownChange}
                variant="menu"
                position="right"
                trigger={
                  <button className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
                    <img src="/icon-settings.svg" alt="Settings" className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity duration-200" />
                  </button>
                }
                menuClassName="w-48"
              />
            </div>
            <div className="absolute top-3 left-3">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="peer h-5 w-5 appearance-none rounded border-2 border-gray-300 transition-all duration-400 ease-in-out cursor-pointer
                    checked:bg-blue-600 checked:border-blue-600"
                />
                <svg
                  className="absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-400 ease-in-out pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="flex-1 w-full mt-10">
              <div className={`flex items-center gap-5${!todo.description ? ' mb-8' : ''}`}>
                <span className={`transition-all duration-300 ease-in-out text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{todo.text}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium transition-all duration-300 ease-in-out ${todo.completed ? 'opacity-50' : ''} ${todo.priority === 'high' ? 'bg-red-100 text-red-800' : todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {todo.priority}
                </span>
              </div>
              {todo.description && (
                <div className="mt-1 mb-8 w-[90%]">
                  <p
                    ref={descriptionRef}
                    className={`text-sm transition-all duration-300 ease-in-out ${todo.completed ? 'text-gray-400' : 'text-gray-500'} ${!isExpanded ? 'line-clamp-2' : ''}`}
                  >
                    {todo.description}
                  </p>
                  {isOverflowing && (
                    <button
                      onClick={toggleDescription}
                      className="text-sm text-blue-600 hover:text-blue-800 mt-1 font-medium"
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
              {todo.dueDate && (
                <span className={`text-sm transition-all duration-300 ease-in-out ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              <span className={`text-sm transition-all duration-300 ease-in-out ${todo.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                Created: {new Date(todo.createdAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        closeButton={true}
      >
        <TodoForm
          onClose={handleModalClose}
          initialData={todo}

        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Task</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the task <span className="font-semibold text-gray-900">{todo.text}</span>? This action cannot be undone.
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
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 active:bg-red-700"
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TodoItem; 