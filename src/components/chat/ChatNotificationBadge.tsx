import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import { ChatRoom } from '../../types/chat';

interface ChatNotificationBadgeProps {
  children: React.ReactNode;
}

const ChatNotificationBadge: React.FC<ChatNotificationBadgeProps> = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadUnreadCount = async () => {
      try {
        const chatRooms = await chatService.getUserChatRooms(user.id.toString());
        // For now, we'll just show the number of active chats
        // In a full implementation, you'd track read/unread status
        setUnreadCount(chatRooms.length);
      } catch (error) {
        console.error('Error loading chat notifications:', error);
      }
    };

    loadUnreadCount();
  }, [user]);

  return (
    <div className="relative">
      {children}
      {unreadCount > 0 && (
        <span className="navbar-badge">{unreadCount}</span>
      )}
    </div>
  );
};

export default ChatNotificationBadge;