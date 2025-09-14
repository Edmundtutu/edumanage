import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Image, Video, X } from 'lucide-react';
import { ChatMessage } from '../../types/chat';

interface ChatInputProps {
  onSendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) => void;
  onTyping: (isTyping: boolean) => void;
  onStartRecording: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping, onStartRecording }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    onTyping(value.length > 0);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const fileType = selectedFile.type.startsWith('image/') ? 'image' :
                        selectedFile.type.startsWith('video/') ? 'video' : 'file';

        onSendMessage({
          type: fileType,
          text: message || `Shared ${fileType}`,
          fileUrl: reader.result as string,
          fileName: selectedFile.name,
          fileSize: formatFileSize(selectedFile.size),
          senderId: '',
          senderName: '',
          senderRole: 'student'
        });

        // Reset state
        setSelectedFile(null);
        setFilePreview(null);
        setMessage('');
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedFile) {
      handleSendFile();
      return;
    }

    if (!message.trim()) return;

    onSendMessage({
      type: 'text',
      text: message.trim(),
      senderId: '',
      senderName: '',
      senderRole: 'student'
    });

    setMessage('');
    onTyping(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      {/* File Preview */}
      {selectedFile && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-3">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
              ) : (
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                  <Paperclip className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-end space-x-3">
          {/* Attachment Button */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          </div>

          {/* Voice Recording Button */}
          <button
            type="button"
            onClick={onStartRecording}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!message.trim() && !selectedFile) || isUploading}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;