import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ src, autoplay = false, loop = false,  muted = false }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    // Event listener to blur the audio element after interaction
    const handleInteractionEnd = () => {
      audio.blur(); // This removes focus from the audio element
    };

    // Add event listeners for interactions
    audio.addEventListener('play', handleInteractionEnd);
    audio.addEventListener('pause', handleInteractionEnd);
    audio.addEventListener('ended', handleInteractionEnd);
    audio.addEventListener('muted', handleInteractionEnd);

    // Cleanup function to remove event listeners
    return () => {
      audio.removeEventListener('play', handleInteractionEnd);
      audio.removeEventListener('pause', handleInteractionEnd);
      audio.removeEventListener('ended', handleInteractionEnd);
      audio.removeEventListener('muted', handleInteractionEnd);
    };
  }, [src]); // Dependency array to rerun the effect if src changes

  return (
    <audio 
      ref={audioRef} 
      src={src} 
      controls 
      autoPlay={autoplay} // Corrected attribute name to autoPlay
      loop={loop}
      muted={muted}
      style={{ width: '75%' }}
    />
  );
};

export default AudioPlayer;
