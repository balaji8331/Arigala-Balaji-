import React, { useState, useRef } from 'react';
import { Mic, Square, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface AudioRecorderProps {
  onAudioData: (audioData: Float32Array) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioData }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        onAudioData(audioBuffer.getChannelData(0));
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Error accessing microphone');
      console.error('Error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      onAudioData(audioBuffer.getChannelData(0));
      toast.success('Audio file processed successfully');
    } catch (error) {
      toast.error('Error processing audio file');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white transition-colors`}
      >
        {isRecording ? (
          <>
            <Square className="w-4 h-4" /> Stop Recording
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" /> Start Recording
          </>
        )}
      </button>

      <label className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg cursor-pointer flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Upload Audio
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};