import React, { useState } from 'react';
import { AudioRecorder } from './components/AudioRecorder';
import { Dashboard } from './components/Dashboard';
import { AlertTriangle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const [audioData, setAudioData] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<{ label: string; confidence: number }[]>([]);

  const handleAudioData = async (data: Float32Array) => {
    // For demo purposes, we're using a simplified mock prediction
    // In a real app, you would use TensorFlow.js here
    const mockPrediction = {
      label: Math.random() > 0.7 ? 'distress' : 'normal',
      confidence: 0.7 + Math.random() * 0.3
    };

    setAudioData(Array.from(data.slice(0, 1000))); // Show first 1000 samples
    setPredictions([mockPrediction]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Audio Distress Detection
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Record or Upload Audio</h2>
            <AudioRecorder onAudioData={handleAudioData} />
          </div>

          {audioData.length > 0 && (
            <Dashboard audioData={audioData} predictions={predictions} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;