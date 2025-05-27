import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { addTodoAtom, updateTodoAtom } from '../../features/todos/store/todoAtoms';
import { Todo } from '../../features/todos/types/todo';
import Dropdown from '../common/Dropdown';
import Input from '../common/Input';
import Button from '../common/Button';

interface TodoFormProps {
  onClose?: () => void;
  initialGroup?: string;
  initialData?: Todo;
  existingGroups?: string[];
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onClose, 
  initialGroup = '', 
  initialData,
  existingGroups = []
}) => {
  const [, addTodo] = useAtom(addTodoAtom);
  const [, updateTodo] = useAtom(updateTodoAtom);
  const [formData, setFormData] = useState<Omit<Todo, 'id' | 'createdAt' | 'lastModified' | 'isEditing'>>({
    text: initialData?.text || '',
    completed: initialData?.completed || false,
    priority: initialData?.priority || 'medium',
    description: initialData?.description || '',
    group: initialData?.group || initialGroup,
    dueDate: initialData?.dueDate,
  });
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const groupOptions = [
    ...existingGroups.map(group => ({ value: group, label: group })),
    { value: 'new', label: '+ Create New Group', className: 'text-blue-600 hover:bg-blue-50' }
  ];

  const isFormValid = formData.text.trim() !== '' && 
    formData.text.length <= 50 &&
    (isCreatingNewGroup ? newGroupName.trim() !== '' : formData.group.trim() !== '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const finalGroup = isCreatingNewGroup ? newGroupName : formData.group;
      if (initialData) {
        updateTodo({
          id: initialData.id,
          updates: { ...formData, group: finalGroup }
        });
      } else {
        addTodo({ ...formData, group: finalGroup });
      }
      onClose?.();
    }
  };

  const handleGroupChange = (value: string) => {
    if (value === 'new') {
      setIsCreatingNewGroup(true);
      setNewGroupName('');
    } else {
      setIsCreatingNewGroup(false);
      setFormData(prev => ({ ...prev, group: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4">
      <div className="space-y-4">
        {!initialData && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group <span className="text-red-500">*</span>
            </label>
            {isCreatingNewGroup ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Enter new group name..."
                  fullWidth
                  required
                  limit={40}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreatingNewGroup(false)}
                  className="whitespace-nowrap"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Dropdown
                options={groupOptions}
                value={formData.group}
                onChange={handleGroupChange}
                placeholder="Select or create group"
              />
            )}
          </div>
        )}

        <Input
          type="text"
          label="Task Name"
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          placeholder="Add a new task..."
          fullWidth
          required
          limit={50}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            rows={3}
            placeholder="Add a description..."
          />
        </div>

        <Input
          type="datetime-local"
          label="Due Date"
          value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <Dropdown
            options={priorityOptions}
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value as Todo['priority'] }))}
            placeholder="Select priority"
          />
        </div>

        <div className="pt-4 border-t">
          <Button type="submit" fullWidth disabled={!isFormValid}>
            {initialData ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TodoForm; 