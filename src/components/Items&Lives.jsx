import React from 'react';
import satchel from '../assets/images/ui-elements/satchel.png';
import knight from '../assets/images/ui-elements/live-knight.png';
import '../assets/CSS/layout.css';

function ItemsAndLives({ livesLeft }) {
    return (
        <div id="itemsAndLives">
            <span id="satchel">
                <img alt="an image of a satchel" src={satchel} width="85" height="85" />
            </span>
            {Array.from({ length: livesLeft }, (_, i) => (
                <span key={i}>
                    <img alt={`Life ${i + 1}`} src={knight} width="85" height="85" />
                </span>
            ))}
        </div>
    );    
}

export default ItemsAndLives;
