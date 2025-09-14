import { 
  ref, 
  push, 
  onValue, 
  off, 
  set, 
  remove, 
  query, 
  orderByChild, 
  limitToLast,
  serverTimestamp,
  get
} from 'firebase/database';
import { database } from '../config/firebase';
import { ChatMessage, ChatRoom, TypingUser } from '../types/chat';
import { User } from '../types';

class ChatService {
  // Create or get chat room
  async createChatRoom(participants: string[], type: 'direct' | 'group', name?: string): Promise<string> {
    const chatRoomsRef = ref(database, 'chats');
    
    // For direct messages, check if room already exists
    if (type === 'direct' && participants.length === 2) {
      const existingRoom = await this.findDirectChatRoom(participants[0], participants[1]);
      if (existingRoom) {
        return existingRoom;
      }
    }

    const newChatRef = push(chatRoomsRef);
    const chatRoomId = newChatRef.key!;

    const chatRoom: Omit<ChatRoom, 'id'> = {
      type,
      name: name || (type === 'direct' ? 'Direct Message' : 'Group Chat'),
      participants,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    await set(ref(database, `chats/${chatRoomId}/metadata`), chatRoom);
    
    return chatRoomId;
  }

  // Find existing direct chat room between two users
  private async findDirectChatRoom(userId1: string, userId2: string): Promise<string | null> {
    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);
    
    if (!snapshot.exists()) return null;

    const chats = snapshot.val();
    
    for (const [chatId, chatData] of Object.entries(chats as Record<string, any>)) {
      const metadata = chatData.metadata;
      if (
        metadata?.type === 'direct' &&
        metadata?.participants?.length === 2 &&
        metadata.participants.includes(userId1) &&
        metadata.participants.includes(userId2)
      ) {
        return chatId;
      }
    }
    
    return null;
  }

  // Send message
  async sendMessage(chatRoomId: string, message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>): Promise<void> {
    const messagesRef = ref(database, `chats/${chatRoomId}/messages`);
    const newMessageRef = push(messagesRef);
    
    const messageData: ChatMessage = {
      ...message,
      id: newMessageRef.key!,
      timestamp: Date.now(),
      status: 'sent'
    };

    await set(newMessageRef, messageData);
    
    // Update last activity
    await set(ref(database, `chats/${chatRoomId}/metadata/lastActivity`), Date.now());
    await set(ref(database, `chats/${chatRoomId}/metadata/lastMessage`), messageData);
  }

  // Listen to messages
  subscribeToMessages(chatRoomId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const messagesRef = query(
      ref(database, `chats/${chatRoomId}/messages`),
      orderByChild('timestamp')
    );

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key!,
            ...childSnapshot.val()
          });
        });
      }
      
      callback(messages);
    });

    return () => off(messagesRef, 'value', unsubscribe);
  }

  // Typing indicators
  async setTyping(chatRoomId: string, user: User, isTyping: boolean): Promise<void> {
    const typingRef = ref(database, `chats/${chatRoomId}/typing/${user.id}`);
    
    if (isTyping) {
      await set(typingRef, {
        name: user.name,
        timestamp: Date.now()
      });
    } else {
      await remove(typingRef);
    }
  }

  // Listen to typing indicators
  subscribeToTyping(chatRoomId: string, currentUserId: string, callback: (typingUsers: TypingUser[]) => void): () => void {
    const typingRef = ref(database, `chats/${chatRoomId}/typing`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      const typingUsers: TypingUser[] = [];
      const now = Date.now();
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userId = childSnapshot.key!;
          const data = childSnapshot.val();
          
          // Only include other users and recent typing (within 3 seconds)
          if (userId !== currentUserId && (now - data.timestamp) < 3000) {
            typingUsers.push({
              userId,
              name: data.name,
              timestamp: data.timestamp
            });
          }
        });
      }
      
      callback(typingUsers);
    });

    return () => off(typingRef, 'value', unsubscribe);
  }

  // Get user's chat rooms
  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    const chatsRef = ref(database, 'chats');
    const snapshot = await get(chatsRef);
    
    if (!snapshot.exists()) return [];

    const chatRooms: ChatRoom[] = [];
    const chats = snapshot.val();
    
    for (const [chatId, chatData] of Object.entries(chats as Record<string, any>)) {
      const metadata = chatData.metadata;
      if (metadata?.participants?.includes(userId)) {
        chatRooms.push({
          id: chatId,
          ...metadata
        });
      }
    }
    
    // Sort by last activity
    return chatRooms.sort((a, b) => b.lastActivity - a.lastActivity);
  }

  // Clean up old typing indicators
  async cleanupTyping(chatRoomId: string): Promise<void> {
    const typingRef = ref(database, `chats/${chatRoomId}/typing`);
    const snapshot = await get(typingRef);
    
    if (!snapshot.exists()) return;

    const now = Date.now();
    const updates: Record<string, null> = {};
    
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      if (now - data.timestamp > 3000) {
        updates[childSnapshot.key!] = null;
      }
    });

    if (Object.keys(updates).length > 0) {
      await set(typingRef, updates);
    }
  }
}

export const chatService = new ChatService();
export default chatService;