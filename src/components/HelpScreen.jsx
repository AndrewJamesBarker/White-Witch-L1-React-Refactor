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
          <div id="helpLivesItems">
            <h3 className="centerText">Lives And Items</h3>
            <p>There are 3 lives. Each one represented by a knight in the lower right corner. If you lose all 3, you will have to start over.</p>
            <p>You can also accumulate items. They are stored in the satchel (lower right screen) and you check your item inventory either by typing I, or by clicking on the satchel</p>
          </div>   
          <p>Good luck!</p>
    </div>
  );
}

export default HelpScreen;