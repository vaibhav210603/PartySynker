import React, { useState, useEffect, useRef } from 'react';
import './Player.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Player = () => {
  const [audioURL, setAudioURL] = useState(null);
  const audioRef = useRef(null);

  const manageClick = () => {
    socket.emit('ReqAudio');
    console.log(socket.id);
  };

  const syncPlay = () => {
    socket.emit('request_time');
    console.log("Time synchronization requested");
  };

  useEffect(() => {
    socket.on('song', (song) => {
      const audioBlob = new Blob([song], { type: 'audio/mpeg' });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    });

    return () => {
      socket.off('song'); // Cleanup the event listener
    };
  }, []);

  useEffect(() => {
    const playAudioAtTime = (delayed_time) => {
      const now = new Date().getTime();
      const timeToWait = delayed_time - now;
      if (timeToWait > 0) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play(); // Start playback when delayed_time is reached
          }
        }, timeToWait);
      } else {
        if (audioRef.current) {
          audioRef.current.play(); // Start playback immediately if delayed_time has already passed
        }
      }
    };

    socket.on('time_to_play_at', (delayed_time) => {
      const now = new Date().getTime();
      console.log("Current time:", new Date(now));
      console.log("Requested time to play at:", new Date(delayed_time));
      playAudioAtTime(delayed_time); // Schedule playback to start at delayed_time
    });

    return () => {
      socket.off('time_to_play_at'); // Cleanup the event listener
    };
  }, []);

  return (
    <div className="player-container">
      {audioURL && <audio ref={audioRef} controls src={audioURL}></audio>}
      <button onClick={manageClick}>Request File</button>
      <button onClick={syncPlay}>PLAY IN SYNC</button>
    </div>
  );
};

export default Player;
