import React, { useState } from 'react';
import { ChatRoom } from '../types/chat';
import ChatList from '../components/chat/ChatList';
import ChatView from '../components/chat/ChatView';
import { MessageCircle, Users } from 'lucide-react';

const Chat: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<{
    chatRoomId: string;
    chatRoom: ChatRoom;
  } | null>(null);

  const handleSelectChat = (chatRoomId: string, chatRoom: ChatRoom) => {
    setSelectedChat({ chatRoomId, chatRoom });
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-100">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={`w-full lg:w-1/3 lg:border-r lg:border-gray-200 ${
        selectedChat ? 'hidden lg:block' : 'block'
      }`}>
        <ChatList 
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChat?.chatRoomId}
        />
      </div>

      {/* Chat View - Hidden on mobile when no chat selected */}
      <div className={`w-full lg:w-2/3 ${
        selectedChat ? 'block' : 'hidden lg:block'
      }`}>
        {selectedChat ? (
          <ChatView
            chatRoomId={selectedChat.chatRoomId}
            chatRoom={selectedChat.chatRoom}
            onBack={handleBackToList}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to EduManage Chat</h3>
              <p className="text-gray-500 max-w-sm">
                Select a conversation from the sidebar to start chatting with your classmates and teachers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;