import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateTask: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateTask }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center px-4">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Plus className="w-12 h-12 text-blue-500" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Welcome to Your Todo App!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Get started by creating your first task. You can organize them into groups and set priorities to stay on top of your work.
      </p>
      <button
        onClick={onCreateTask}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Your First Task
      </button>
    </div>
  );
};

export default EmptyState; 