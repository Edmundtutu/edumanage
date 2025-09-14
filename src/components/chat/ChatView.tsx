import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../Toast';
import { chatService } from '../../services/chatService';
import { ChatMessage, ChatRoom, TypingUser } from '../../types/chat';
import MessageItem from './MessageItem';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import VoiceRecorder from './VoiceRecorder';
import { ArrowLeft, Phone, Video, MoreVertical, Users } from 'lucide-react';

interface ChatViewProps {
  chatRoomId: string;
  chatRoom: ChatRoom;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ chatRoomId, chatRoom, onBack }) => {
  const { user } = useAuth();
  const { error: showError } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!chatRoomId || !user) return;

    // Subscribe to messages
    const unsubscribeMessages = chatService.subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
    });

    // Subscribe to typing indicators
    const unsubscribeTyping = chatService.subscribeToTyping(chatRoomId, user.id.toString(), (users) => {
      setTypingUsers(users);
    });

    // Cleanup function
    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatRoomId, user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageData: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => {
    if (!user) return;

    try {
      await chatService.sendMessage(chatRoomId, {
        ...messageData,
        senderId: user.id.toString(),
        senderName: user.name,
        senderRole: user.role
      });
    } catch (error) {
      showError('Failed to send message', 'Please try again');
      console.error('Send message error:', error);
    }
  };

  const handleTyping = async (isTyping: boolean) => {
    if (!user) return;

    try {
      await chatService.setTyping(chatRoomId, user, isTyping);
      
      if (isTyping) {
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set timeout to stop typing after 2 seconds
        typingTimeoutRef.current = setTimeout(() => {
          chatService.setTyping(chatRoomId, user, false);
        }, 2000);
      }
    } catch (error) {
      console.error('Typing indicator error:', error);
    }
  };

  const getChatTitle = () => {
    if (chatRoom.type === 'group') {
      return chatRoom.name;
    }
    
    // For direct messages, show the other participant's name
    const otherParticipantId = chatRoom.participants.find(id => id !== user?.id.toString());
    return `Direct Message`; // You can enhance this to show actual participant name
  };

  const getParticipantCount = () => {
    return chatRoom.participants.length;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              {chatRoom.type === 'group' ? (
                <Users className="h-5 w-5 text-white" />
              ) : (
                <span className="text-white font-medium text-sm">
                  {getChatTitle().charAt(0)}
                </span>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{getChatTitle()}</h3>
              <p className="text-sm text-gray-500">
                {chatRoom.type === 'group' 
                  ? `${getParticipantCount()} participants`
                  : 'Direct message'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
            <p className="text-gray-500">Send a message to begin chatting</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.senderId === user?.id.toString()}
              showSender={chatRoom.type === 'group'}
            />
          ))
        )}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recorder */}
      {isRecording && (
        <VoiceRecorder
          onSend={(audioBlob) => {
            // Convert audio to base64 and send
            const reader = new FileReader();
            reader.onload = () => {
              handleSendMessage({
                type: 'audio',
                text: 'Voice message',
                senderId: user!.id.toString(),
                senderName: user!.name,
                senderRole: user!.role,
                fileUrl: reader.result as string
              });
            };
            reader.readAsDataURL(audioBlob);
            setIsRecording(false);
          }}
          onCancel={() => setIsRecording(false)}
        />
      )}

      {/* Chat Input */}
      {!isRecording && (
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStartRecording={() => setIsRecording(true)}
        />
      )}
    </div>
  );
};

export default ChatView;