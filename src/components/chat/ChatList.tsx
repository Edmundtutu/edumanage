import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import { users } from '../../data/mockData';
import { ChatRoom } from '../../types/chat';
import { User } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { Search, Plus, Users as UsersIcon, MessageCircle, User as UserIcon } from 'lucide-react';

interface ChatListProps {
  onSelectChat: (chatRoomId: string, chatRoom: ChatRoom) => void;
  selectedChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadChatRooms = async () => {
      try {
        const rooms = await chatService.getUserChatRooms(user.id.toString());
        setChatRooms(rooms);
      } catch (error) {
        console.error('Error loading chat rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, [user]);

  const filteredChatRooms = chatRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailableUsers = (): User[] => {
    if (!user) return [];
    
    // Filter users based on role and school
    return users.filter(u => {
      if (u.id === user.id) return false; // Exclude self
      if (!u.school_ids?.includes(user.current_school_id || 0)) return false; // Same school only
      
      // Role-based filtering
      if (user.role === 'student') {
        // Students can chat with teachers and other students in their classes
        return (u.role === 'teacher' && u.class_ids?.some(classId => user.class_ids?.includes(classId))) ||
               (u.role === 'student' && u.class_ids?.some(classId => user.class_ids?.includes(classId)));
      } else if (user.role === 'teacher') {
        // Teachers can chat with students in their classes and other teachers
        return (u.role === 'student' && u.class_ids?.some(classId => user.class_ids?.includes(classId))) ||
               u.role === 'teacher' || u.role === 'school_admin';
      } else {
        // Admins can chat with everyone in their school
        return true;
      }
    });
  };

  const startDirectChat = async (otherUser: User) => {
    if (!user) return;

    try {
      const chatRoomId = await chatService.createChatRoom(
        [user.id.toString(), otherUser.id.toString()],
        'direct',
        `${user.name} & ${otherUser.name}`
      );

      const chatRoom: ChatRoom = {
        id: chatRoomId,
        type: 'direct',
        name: otherUser.name,
        participants: [user.id.toString(), otherUser.id.toString()],
        createdAt: Date.now(),
        lastActivity: Date.now()
      };

      onSelectChat(chatRoomId, chatRoom);
      setShowNewChatModal(false);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const formatLastActivity = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getOtherParticipantName = (room: ChatRoom) => {
    if (room.type === 'group') return room.name;
    
    const otherParticipantId = room.participants.find(id => id !== user?.id.toString());
    const otherUser = users.find(u => u.id.toString() === otherParticipantId);
    return otherUser?.name || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChatRooms.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-500 mb-4">Start a new conversation to begin chatting</p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredChatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectChat(room.id, room)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedChatId === room.id ? 'bg-primary-50 border-r-4 border-primary' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    {room.type === 'group' ? (
                      <UsersIcon className="h-6 w-6 text-gray-600" />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getOtherParticipantName(room)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatLastActivity(room.lastActivity)}
                      </span>
                    </div>
                    
                    {room.lastMessage && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {room.lastMessage.type === 'text' 
                          ? room.lastMessage.text 
                          : `📎 ${room.lastMessage.type}`
                        }
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <span className="h-5 w-5 text-gray-500">&times;</span>
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {getAvailableUsers().map((availableUser) => (
                  <button
                    key={availableUser.id}
                    onClick={() => startDirectChat(availableUser)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {availableUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900">{availableUser.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{availableUser.role.replace('_', ' ')}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              {getAvailableUsers().length === 0 && (
                <div className="text-center py-8">
                  <UsersIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No users available to chat with</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;