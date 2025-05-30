import React from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import Grinn from "../../assets/images/portraits/Grinn.webp";


const NoPlayPage = () => {
  return (
    <div id="noPlayBox">
      <h3 className="standard-text" >Alright, refresh if you change your mind.</h3>
      <img className="imageMaterialize mediumImage" 
      alt="Grinn, a cross between a sprite, a hedgehog and a tree" src={Grinn} width="200" height="200" loading="eager" decoding="async"/>
    </div>
  );
};

export default NoPlayPage;

