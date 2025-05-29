import React, { useEffect } from 'react';
import '../../assets/CSS/layout.css';

function ChapterTwo({ 
  currentChapter, 
  setCurrentChapter}
) {
  const handleKeyDown = (event) => {
    // console.log("Key pressed:", event.key);
    if (event.key === "Enter") {
      // console.log("Enter key was pressed");
    }
    if (event.key === "C" || event.key === "c") {
      // console.log("C key was pressed");
      // Add your logic for what happens when 'C' is pressed
    }
  };

  useEffect(() => {
    // Attach the event listener to the window object
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div id="ChapterTwoPage" className="widthControl">
      
      <h2 id="headLine">Chapter Two: The Fields</h2>
      <div className="cursorBox">
        <h3 id="displayBlock">To be continued...</h3>
        <p id="bodyText"></p>
      </div>
    </div>
  );
}

export default ChapterTwo;
