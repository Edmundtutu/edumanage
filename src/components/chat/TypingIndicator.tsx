import React from 'react';
import { TypingUser } from '../../types/chat';

interface TypingIndicatorProps {
  users: TypingUser[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (users.length === 0) return null;

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`;
    } else {
      return 'Several people are typing...';
    }
  };

  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-xs text-gray-500">{getTypingText()}</span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;