import React from "react";
import { Navigate, useNavigate } from 'react-router-dom';


// Images
import Bandcamp from "../../assets/images/socials/bandcamp-icon.png";

const Register = () => {
  const navigate = useNavigate();
  
  const onRegister = () => {
    navigate('/register');
  };

  const onDeclineRegister = () => {
    navigate('/dashboard');
    // This condition needs to be decided upon, possible warning message and then navigate to the next chapter
};
  
  return (
    <div id="startBox" className="widthControl">
      <div>
        <h2 id="startPrompt">
          Great job so far! Do you want to register?
        </h2>
      </div>
      {/* <p className="standardText">Like the music you heard?</p> */}
      <p className="standardText ">Registering will automatically update your progress as you play. You will also receive a free download code for my album White Witch! I will not share your info with third parties, but you will receive occasional emails regarding the progress of this game (which you can opt out of.)</p>
      {/* <div className="imageMaterialize imagePulse">
        <img className="borderRadius" alt="The bandcamp music distributionicon" src={Bandcamp} width="110" height="50"></img>
      </div> */}
      <button onClick={onRegister} className="btn">Register</button>
      <div>
        <p className="standardText">Be forewarned, unregistered players may not be able to preserve their game state beyond this stage.</p>
        <button onClick={onDeclineRegister} className="btn">No thanks!</button>
      </div>
      

    </div>
  );
}

export default Register;