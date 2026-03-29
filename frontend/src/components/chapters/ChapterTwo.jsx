import React, { useEffect, useState } from 'react';
import '../../assets/CSS/layout.css';
import '../../assets/CSS/images.css';
import Marsh from '../../assets/images/environment/Marsh1.webp';
import Grinn from '../../assets/images/portraits/Grinn.webp';

function ChapterTwo({ 
  currentChapter,
  setCurrentChapter,
}
) {
  void currentChapter;
  void setCurrentChapter;

  const [grinnParallaxY, setGrinnParallaxY] = useState(0);
  const [grinnHoverY, setGrinnHoverY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollOffset = Math.min(window.scrollY * 0.5, 260);
      setGrinnParallaxY(scrollOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;

    const animateHover = () => {
      const timeSeconds = performance.now() / 1000;
      const hoverOffset = Math.sin(timeSeconds * 2.2) * 5;
      setGrinnHoverY(hoverOffset);
      animationFrameId = window.requestAnimationFrame(animateHover);
    };

    animationFrameId = window.requestAnimationFrame(animateHover);
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div id="ChapterTwoPage" className="widthControl">
      <h2 id="headLine">Chapter Two: The Fields</h2>
      <div className="cursorBox">
        <div
          style={{
            position: 'relative',
            width: '98%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <img
            className="environImage"
            src={Marsh}
            alt="A labyrinthine marshland vista."
            width="500"
            height="500"
            loading="eager"
            decoding="async"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />

          <img
            src={Grinn}
            alt="Grinn watching from the marsh foreground."
            width="168"
            height="168"
            loading="eager"
            decoding="async"
            style={{
              position: 'absolute',
              left: '50%',
              top: '18%',
              width: '168px',
              height: '168px',
              zIndex: 30,
              filter: 'drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35))',
              transform: `translate(-50%, ${-84 + grinnParallaxY + grinnHoverY}px)`,
            }}
          />
        </div>

        <p id="bodyText" className="standard-text">
          The marsh breathes in quiet pulses around you. Grinn appears at the edge of
          your view, watching from the reeds.
        </p>
      </div>
    </div>
  );
}

export default ChapterTwo;
