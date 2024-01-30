import React from "react";
import "../../assets/CSS/layout.css";
import "../../assets/CSS/images.css";
import Silva from "../../assets/images/portraits/Silva.png";


const NoPlayPage = () => {
  return (
    <div id="noPlayBox">
      <h3 className="standardText" >Alright, refresh if you change your mind.</h3>
      <img className="imageMaterialize mediumImage" alt="Silva, a cross between a sprite, a hedgehog and a tree" src={Silva} width="200" height="200" />
    </div>
  );
};

export default NoPlayPage;

