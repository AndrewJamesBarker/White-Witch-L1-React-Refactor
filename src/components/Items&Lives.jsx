import React from 'react';
import satchelImage from '../assets/images/SatchelGood.png';
import userLife from '../assets/images/UserLives.png';
import '../assets/CSS/layout.css';

function ItemsAndLives({ livesLeft }) {
    return (
        <div id="itemsAndLives">
            <span id="satchel">
                <img alt="an image of a satchel" src={satchelImage} width="65" height="65" />
            </span>
            {Array.from({ length: livesLeft }, (_, i) => (
                <span key={i}>
                    <img alt={`Life ${i + 1}`} src={userLife} width="65" height="65" />
                </span>
            ))}
        </div>
    );    
}

export default ItemsAndLives;
