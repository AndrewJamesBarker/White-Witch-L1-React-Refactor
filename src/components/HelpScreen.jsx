import React from "react";


const HelpScreen = ({ onHelpScreen }) => {

  return (
    <div id="helpBox">
        <span>
          <h3 id="helpPrompt">Help</h3>
          <p>Press <span className="boldText">'H'</span> at any time to open or close this screen.</p>
          </span>
        <h4 id="helpText"></h4>
          This is a text based game comprised of:
          <ul id="helpList">
            <li>Keystroke commands</li>
            <li>Multiple choice buttons</li>
            <li>Interactive elements (Hint: Drag & Drop).</li>
          </ul>   
    </div>
  );
}

export default HelpScreen;