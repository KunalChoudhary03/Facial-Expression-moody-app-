import React, { useState, useRef, useEffect } from 'react';
import './MoodSongs.css';

const MoodSongs = ({ songs }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(new Audio());

  const handlePlayPause = (songUrl) => {
    if (currentSong === songUrl) {
      audioRef.current.pause();
      setCurrentSong(null);
    } else {
      audioRef.current.src = songUrl;
      audioRef.current.play();
      setCurrentSong(songUrl);
    }
  };

  // Auto play first song when songs list changes
  useEffect(() => {
    if (Array.isArray(songs) && songs.length > 0) {
      audioRef.current.pause();
      audioRef.current.src = songs[0].audio;
      audioRef.current.play().catch((e) => {
        console.warn('Autoplay failed:', e);
      });
      setCurrentSong(songs[0].audio);
    } else {
      audioRef.current.pause();
      setCurrentSong(null);
    }
  }, [songs]);

  return (
    <div className='mood-song'>
      <h2>Recommended Songs</h2>
      {Array.isArray(songs) && songs.map((song, index) => (
        <div
          key={index}
          className="song-item"
        >
          <div className='title'>
            <h3>{song.title}</h3>
            <p >{song.artist}</p>
          </div>
          <div
            className='play-pause-button'
            onClick={() => handlePlayPause(song.audio)}
          >
            {currentSong === song.audio ? '⏸️' : '▶️'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoodSongs;
