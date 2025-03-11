import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  audioData: number[];
  predictions: { label: string; confidence: number }[];
}

export const Dashboard: React.FC<DashboardProps> = ({ audioData, predictions }) => {
  const chartData = {
    labels: audioData.map((_, i) => i),
    datasets: [
      {
        label: 'Audio Waveform',
        data: audioData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Audio Waveform'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Audio Visualization</h2>
        <Line data={chartData} options={options} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Detection Results</h2>
        <div className="space-y-2">
          {predictions.map((pred, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                pred.label === 'distress' && pred.confidence > 0.7
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-100 border-gray-300'
              } border`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{pred.label}</span>
                <span className="text-sm">
                  {(pred.confidence * 100).toFixed(2)}% confidence
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};