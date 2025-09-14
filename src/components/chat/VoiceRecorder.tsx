import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send, X, Play, Pause } from 'lucide-react';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  onCancel: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Request microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playPreview = () => {
    if (!audioBlob) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === false) {
    return (
      <div className="p-4 bg-red-50 border-t border-red-200">
        <div className="text-center">
          <Mic className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-red-700 mb-3">Microphone access is required for voice messages</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-center space-x-4">
        {!isRecording && !audioBlob && (
          <>
            <button
              onClick={onCancel}
              className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button
              onClick={startRecording}
              className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors animate-pulse"
            >
              <Mic className="h-8 w-8" />
            </button>
            
            <div className="w-12" /> {/* Spacer */}
          </>
        )}

        {isRecording && (
          <>
            <button
              onClick={onCancel}
              className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-lg font-mono text-gray-700">{formatTime(recordingTime)}</span>
            </div>
            
            <button
              onClick={stopRecording}
              className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Square className="h-6 w-6" />
            </button>
          </>
        )}

        {audioBlob && !isRecording && (
          <>
            <button
              onClick={onCancel}
              className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <button
              onClick={playPreview}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            
            <span className="text-sm text-gray-600">{formatTime(recordingTime)}</span>
            
            <button
              onClick={handleSend}
              className="p-3 bg-primary text-white rounded-full hover:bg-primary-700 transition-colors"
            >
              <Send className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Recording Instructions */}
      {!isRecording && !audioBlob && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Tap the microphone to start recording
        </p>
      )}
      
      {isRecording && (
        <p className="text-center text-sm text-gray-600 mt-2">
          Recording... Tap stop when finished
        </p>
      )}
      
      {audioBlob && !isRecording && (
        <p className="text-center text-sm text-gray-600 mt-2">
          Tap play to preview, then send or cancel
        </p>
      )}
    </div>
  );
};

export default VoiceRecorder;