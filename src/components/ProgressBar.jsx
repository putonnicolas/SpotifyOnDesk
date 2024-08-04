import React, { useState, useEffect } from 'react';

const ProgressBar = ({ trackDuration, trackProgress }) => {

  const [progress, setProgress] = useState(trackProgress);

  useEffect(() => {
    setProgress(trackProgress);
  }, [trackProgress]);

  const handleSeek = (event) => {
    const { left, width } = event.target.getBoundingClientRect();
    const clickPosition = event.clientX - left;
    const newProgress = (clickPosition / width) * trackDuration;
    setProgress(newProgress);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = Math.min(prevProgress + 1000, trackDuration);
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [trackDuration]);

  return (
    <div className="mt-10 mb-5 pr-5 pl-5 w-full flex flex-col items-center">
      <div className="flex justify-between w-full text-sm mb-1">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(trackDuration)}</span>
      </div>
      <div
        className="relative w-full h-1 bg-gray-600 rounded cursor-pointer"      >
        <div
          className="absolute top-0 left-0 h-1 bg-white rounded"
          style={{ width: `${(progress / trackDuration) * 100}%`, transition: 'width 2s linear'}}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
