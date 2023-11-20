import React from 'react';
import satchelImage from '../assets/images/SatchelGood.png';
import userLife from '../assets/images/UserLives.png';
import '../assets/CSS/layout.css';

function ItemsAndLives() {
    return (
        <div id="itemsAndLives">
            <span id="satchel">
                <img alt="an image of a satchel" src={satchelImage} width="65" height="65" />
            </span>
            <span id="lifeOne">
                <img alt="an image of a knight depicting the first of three of the user's lives" src={userLife} width="65" height="65" />
            </span>
            <span id="lifeTwo">
                <img alt="an image of a knight depicting the second of three of the user's lives" src={userLife} width="65" height="65" />
            </span>
            <span id="lifeThree">
                <img alt="an image of a knight depicting the third of three of the user's lives" src={userLife} width="65" height="65" />
            </span>
        </div>
    );    
}

export default ItemsAndLives;
