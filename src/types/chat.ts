export interface ChatMessage {
  id: string;
  text?: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'school_admin' | 'super_admin';
  timestamp: number;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: string[];
  createdAt: number;
  lastMessage?: ChatMessage;
  lastActivity: number;
}

export interface TypingUser {
  userId: string;
  name: string;
  timestamp: number;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}