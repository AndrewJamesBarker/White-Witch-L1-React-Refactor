import React from 'react';
import satchel from '../../assets/images/ui-elements/satchel.png';
import caballero from '../../assets/images/ui-elements/caballero.png';
import '../../assets/CSS/layout.css';

function ItemsAndLives({ livesLeft, onSatchelClick }) {
    return (
        <div id="itemsAndLives">
            <button id="satchelButton" onClick={onSatchelClick} aria-label="Open inventory" >
                <img alt="an image of a satchel" src={satchel} width="85" height="85" />
            </button>
            {Array.from({ length: livesLeft }, (_, i) => (
                <span key={i}>
                    <img alt={`Life ${i + 1}`} src={caballero} width="85" height="85" />
                </span>
            ))}
        </div>
    );    
}

export default ItemsAndLives;
