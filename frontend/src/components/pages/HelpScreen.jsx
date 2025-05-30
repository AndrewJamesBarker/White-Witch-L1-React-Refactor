import React, { forwardRef } from "react";
import DirectionalKeys from "../../assets/images/ui-elements/directional-keys.webp";

const HelpScreen = forwardRef(({ onHelpScreen }, ref) => {
  // Now you can use `ref` to refer to the component's DOM node and `onHelpScreen` as a regular prop
  return (
    <div ref={ref} className="dynamic-scenes">
      <span>
        <h2>
          White Witch - <span className="blue-text">Help</span>
        </h2>
        <p>
          Press <span className="bold-text blue-text">H</span> at any time to
          open or close this screen.
        </p>
      </span>
      <h4 className="help-text">This is a <span className="blue-text">Text Based</span> game involving: </h4>
      <ol className="help-list">
        <li>
        <span className="blue-text">Keystroke Commands</span> 
          <ul className="custom-bullets">
            <li className="white-text">C = Continue</li>
            <li className="white-text">B = Back</li>
            <li className="white-text">I = Inventory</li>
            <li className="white-text">H = Help</li>
            <li className="white-text">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <span className="blue-text">Directional Arrow Keys</span>
                <img
                  src={DirectionalKeys}
                  alt="Keyboard directional arrow keys"
                  width="55"
                  height="45"
                  loading="eager"
                  decoding="async"
                  className="help-arrow-keys-image"
                />
              </span>
            </li>
          </ul>
        </li>
        <li><span className="blue-text">Multiple Choice Buttons</span></li>
        <li><span className="blue-text">Drag & Drop</span></li>
        <li><span className="blue-text">Clicking on items</span></li>
      </ol>
      <div className="help-lives-items standard-text">
        <h3 className="center-text blue-text">Lives And Items</h3>
        <p className="width-control">
          There are 3 lives. Each one represented by a knight in the lower right
          corner. If you lose all 3, you will have to start over.
        </p>
        <br></br>
        <p className="width-control">
          You can also accumulate items. They are stored in the satchel (lower
          right screen) and you check your item inventory either by typing <span className="bold-text blue-text" > I</span>, or
          by clicking on the satchel.
        </p>
      </div>
      <p className="blue-text bold-text">Good luck!</p>
    </div>
  );
});

export default HelpScreen;
