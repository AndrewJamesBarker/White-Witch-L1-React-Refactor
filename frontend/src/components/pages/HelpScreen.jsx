import React, { forwardRef } from "react";
import DirectionalKeys from "../../assets/images/ui-elements/directional-keys.webp";

const HelpScreen = forwardRef(({ onHelpScreen }, ref) => {
  // Now you can use `ref` to refer to the component's DOM node and `onHelpScreen` as a regular prop
  return (
    <div ref={ref} className="dynamicScenes">
      <span>
        <h2>
          White Witch - <span className="blueText">Help</span>
        </h2>
        <p>
          Press <span className="boldText blueText">H</span> at any time to
          open or close this screen.
        </p>
      </span>
      <h4 id="helpText">This is a <span className="blueText">Text Based</span> game involving: </h4>
      <ol id="helpList">
        <li>
        <span className="blueText">Keystroke Commands</span> 
          <ul className="custom-bullets">
            <li className="whiteText">C = Continue</li>
            <li className="whiteText">B = Back</li>
            <li className="whiteText">I = Inventory</li>
            <li className="whiteText">H = Help</li>
            <li className="whiteText">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src={DirectionalKeys}
                  alt="Keyboard directional arrow keys"
                  width="55"
                  height="45"
                />
                Directional Arrow Keys
              </span>
            </li>
          </ul>
        </li>
        <li><span className="blueText">Multiple Choice Buttons</span></li>
        <li><span className="blueText">Drag & Drop</span></li>
        <li><span className="blueText">Clicking on items</span></li>
      </ol>
      <div id="helpLivesItems standardText">
        <h3 className="centerText blueText">Lives And Items</h3>
        <p className="widthControl">
          There are 3 lives. Each one represented by a knight in the lower right
          corner. If you lose all 3, you will have to start over.
        </p>
        <br></br>
        <p className="widthControl">
          You can also accumulate items. They are stored in the satchel (lower
          right screen) and you check your item inventory either by typing <span className="boldText blueText" > I</span>, or
          by clicking on the satchel.
        </p>
      </div>
      <p className="blueText boldText">Good luck!</p>
    </div>
  );
});

export default HelpScreen;
