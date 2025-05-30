import React from "react";
import { Navigate, useNavigate } from 'react-router-dom';


// Images
// import Bandcamp from "../../assets/images/socials/bandcamp-icon.png";

const Register = () => {
  const navigate = useNavigate();
  
  const onRegister = () => {
    navigate('/register');
  };

  const onDeclineRegister = () => {
   
    navigate('/register');
    // This condition needs to be decided upon.
};
  
  return (
    <div id="startBox" className="widthControl">
      <div>
        <h2 id="startPrompt" className="text-2xl  font-bold">
          <span className="blue-text">Great job so far!</span> Would you like to continue?
        </h2>
      </div>
      {/* <p className="standardText">Like the music you heard?</p> */}
      <p className="standardText ">Registering is free and will automatically update your progress as you play. I will not share your info with third parties, but you will receive occasional emails regarding the progress of this game, which you can opt out of.</p>
      {/* <div className="imageMaterialize imagePulse">
        <img className="borderRadius" alt="The bandcamp music distributionicon" src={Bandcamp} width="110" height="50"></img>
      </div> */}
      <button onClick={onRegister} className="btn">Register</button>
      <div>
        <p className="standardText">Be forewarned, this is the end of the road for unregistered players.</p>
        <button onClick={onDeclineRegister} className="btn">No thanks!</button>
      </div>
      

    </div>
  );
}

export default Register;