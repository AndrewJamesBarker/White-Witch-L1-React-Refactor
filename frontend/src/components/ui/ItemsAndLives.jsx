import React from 'react';
import satchel from '../../assets/images/ui-elements/satchel.webp';
import caballero from '../../assets/images/ui-elements/Caballero.webp';
import '../../assets/CSS/layout.css';

function ItemsAndLives({ livesLeft, onSatchelClick, satchelRef }) {
    return (
        <div id="itemsAndLives">
            <button id="satchelButton" onClick={onSatchelClick} ref={satchelRef} aria-label="Open inventory" >
                <img alt="an image of a satchel" src={satchel} width="65" height="65" />
            </button>
            {Array.from({ length: livesLeft }, (_, i) => (
                <span key={i}>
                    <img alt={`Life ${i + 1}`} src={caballero} width="65" height="65" />
                </span>
            ))}
        </div>
    );    
}

export default ItemsAndLives;
