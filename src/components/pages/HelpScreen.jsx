import React from "react";


const HelpScreen = ({ onHelpScreen }) => {

  return (
    <div className="overlayBox">
        <span>
          <h2>White Witch - Help</h2>
          <p>Press <span className="boldText">'H'</span> at any time to open or close this screen.</p>
          </span>
        <h4 id="helpText">This is a text based game involving: </h4>
          <ol id="helpList">
            <li>
                Keystroke commands
                <ul>
                    <li>C - Continue</li>
                    <li>B - Back</li>
                    <li>I - Inventory</li>
                </ul>
            </li>
            <li>Multiple choice buttons</li>
            <li>Interactive elements (Hint: Drag & Drop)</li>
          </ol>
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