import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarNavItemProps {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  icon?: React.ReactNode;
  isExpandable?: boolean;
  secondaryOptions?: Array<{
    label: string;
    onClick?: () => void;
    isActive?: boolean;
  }>;
}

function SidebarNavItem({ 
  label, 
  onClick, 
  isActive = false, 
  icon,
  isExpandable = false,
  secondaryOptions = []
}: SidebarNavItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded);
    }
    onClick?.();
  };

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        className={`w-full text-left py-2 px-3 rounded-lg transition-colors flex items-center gap-2
          ${isActive 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-gray-100 text-gray-700'
          }`}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span className="flex-grow">{label}</span>
        {isExpandable && (
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} 
          />
        )}
      </button>
      
      {isExpandable && (
        <div 
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="ml-4 mt-1 space-y-1">
            {secondaryOptions.map((option) => (
              <button
                key={option.label}
                onClick={option.onClick}
                className={`w-full text-left py-2 px-3 rounded-lg transition-colors
                  ${option.isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarNavItem; 