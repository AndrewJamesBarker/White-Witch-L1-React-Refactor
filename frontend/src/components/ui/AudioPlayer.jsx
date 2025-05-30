import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ src, autoplay = true, loop = false, muted = false }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = 0.3; // Set initial volume to 30%

      const handleVolumeChange = () => {
          audio.blur(); // Optionally blur if volume is 0
      };

      const handleInteractionEnd = () => {
        audio.blur(); // Blur the audio element after interaction
      };

      // Add event listeners for interactions
      audio.addEventListener('volumechange', handleVolumeChange);
      audio.addEventListener('play', handleInteractionEnd);
      audio.addEventListener('pause', handleInteractionEnd);
      audio.addEventListener('ended', handleInteractionEnd);

      // Cleanup function to remove event listeners
      return () => {
        audio.removeEventListener('volumechange', handleVolumeChange);
        audio.removeEventListener('play', handleInteractionEnd);
        audio.removeEventListener('pause', handleInteractionEnd);
        audio.removeEventListener('ended', handleInteractionEnd);
      };
    }
  }, [src, autoplay, loop, muted]); // Include all relevant props in dependency array

  return (
    <audio 
      ref={audioRef} 
      src={src} 
      controls 
      controlsList="nodownload"
      autoPlay={autoplay}
      loop={loop}
      muted={muted}
      className="w-3/4 max-w-md shadow-lg mx-auto my-6 block"
    />
  );
};

export default AudioPlayer;
