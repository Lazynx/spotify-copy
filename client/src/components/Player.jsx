import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom, faStepBackward, faPlay, faPause, faStepForward, faRepeat, faList, faVolumeUp, faExpand } from '@fortawesome/free-solid-svg-icons';

const Player = () => {
  const { currentSong, togglePlayPause, isPlaying, currentTime, duration, onTimeUpdate, onLoadedMetadata, audioRef } = usePlayer();

  if (!currentSong) {
    return null;
  }

  console.log("Current song:", currentSong);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] p-4 flex items-center justify-between z-50">
      <div className="flex items-center space-x-4">
        <img src={currentSong.image} alt={currentSong.title} className="w-16 h-16 rounded" />
        <div className="flex flex-col">
          <span className="text-white font-bold">{currentSong.title}</span>
          <span className="text-gray-400">{currentSong.artist}</span>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {/* <button className="text-white">
          <FontAwesomeIcon icon={faRandom} />
        </button>
        <button className="text-white">
          <FontAwesomeIcon icon={faStepBackward} />
        </button> */}
        <button className="text-white bg-green-500 p-5 rounded-full" onClick={togglePlayPause}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        {/* <button className="text-white">
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button className="text-white">
          <FontAwesomeIcon icon={faRepeat} />
        </button> */}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-gray-400">{formatTime(currentTime)}</span>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>
        <span className="text-gray-400">{formatTime(duration)}</span>
      </div>
      <audio
        ref={audioRef}
        controls
        autoPlay
        src={currentSong.path}
        className="hidden"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default Player;
