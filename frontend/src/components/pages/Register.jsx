import React from "react";
import { Navigate, useNavigate } from 'react-router-dom';


// Images
import Bandcamp from "../../assets/images/socials/bandcamp-icon.png";

const Register = () => {
  const navigate = useNavigate();
  const onDeclineRegister = () => {
    navigate('/');// This condition needs to be decided upon, possible warning message and then navigate to the next chapter
};
  const onRegister = () => {
    navigate('/register');
  };
  
  return (
    <div id="startBox" className="widthControl">
      <div>
        <h2 id="startPrompt">
          Great job so far! Do you want to register?
        </h2>
      </div>
      {/* <p className="standardText">Like the music you heard?</p> */}
      <p className="standardText ">By registering, not only will you be able to store your progress, you will receive a free download code for the album 'White Witch'!</p>
      {/* <div className="imageMaterialize imagePulse">
        <img className="borderRadius" alt="The bandcamp music distributionicon" src={Bandcamp} width="110" height="50"></img>
      </div> */}
      <button onClick={onRegister} className="btn">Register</button>
      <div>
        <p className="standardText">Be forewarned, unregistered players cannot preserve their game state.</p>
        <button onClick={onDeclineRegister} className="btn">No thanks!</button>
      </div>
      

    </div>
  );
}

export default Register;