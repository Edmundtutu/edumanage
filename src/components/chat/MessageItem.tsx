import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChatMessage } from '../../types/chat';
import { Play, Download, Mic } from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
  showSender?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwn, showSender = false }) => {
  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={message.fileUrl}
              alt="Shared image"
              className="rounded-lg max-w-full h-auto"
              loading="lazy"
            />
            {message.text && (
              <p className="mt-2 text-sm">{message.text}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="max-w-xs">
            <video
              src={message.fileUrl}
              controls
              className="rounded-lg max-w-full h-auto"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
            {message.text && (
              <p className="mt-2 text-sm">{message.text}</p>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <Mic className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <audio
                src={message.fileUrl}
                controls
                className="w-full"
                preload="metadata"
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.fileName || 'File'}
              </p>
              <p className="text-xs text-gray-500">{message.fileSize}</p>
            </div>
          </div>
        );

      default:
        return <p className="text-sm">{message.text}</p>;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        {/* Sender name for group chats */}
        {showSender && !isOwn && (
          <p className="text-xs text-gray-500 mb-1 px-3">
            {message.senderName} • {message.senderRole.replace('_', ' ')}
          </p>
        )}
        
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
          
          {/* Timestamp */}
          <div className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
            {message.status === 'sending' && (
              <span className="ml-1">⏳</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Avatar for received messages */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2 order-2 flex-shrink-0">
          <span className="text-xs font-medium text-gray-700">
            {message.senderName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageItem;