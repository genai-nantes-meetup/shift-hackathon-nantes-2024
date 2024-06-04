import React, { useState, useEffect } from 'react';
import MistralImg from './MistralImg';

// Helper function to generate a color based on the position
const generateGradientColor = (index, total) => {
  const opacity = (index + 1) / total;
  return `rgba(255, 255, 255, ${opacity})`;
};

const TranscriptionList = ({ transcriptions, onBatchComplete }) => {
  const [batch, setBatch] = useState([]);

  // Slice the last 5 transcriptions
  const lastFiveTranscriptions = transcriptions.slice(-5);

  useEffect(() => {
    if (transcriptions.length % 10 === 0 && transcriptions.length > 0) {
      const lastTenTranscriptions = transcriptions.slice(-10);
      setBatch(lastTenTranscriptions);
      onBatchComplete(lastTenTranscriptions);
    }
  }, [transcriptions, onBatchComplete]);

  return (
    <div className="container mx-auto mt-5 p-4 bg-gray-900 text-white rounded-lg">
      <h2 className="text-xl font-semibold mt-4">Transcriptions:</h2>
      <ul className="list-none p-0">
        {lastFiveTranscriptions.map((transcription, index) => (
          <li
            key={index}
            className="bg-gray-800 p-2 my-2 rounded shadow whitespace-pre-wrap"
            style={{ color: generateGradientColor(index, lastFiveTranscriptions.length) }}
          >
            {transcription}
          </li>
        ))}
      </ul>
      {batch.length === 10 && (
        <div className="mt-5">
          <MistralImg transcripts={batch} />
        </div>
      )}
    </div>
  );
};

export default TranscriptionList;
