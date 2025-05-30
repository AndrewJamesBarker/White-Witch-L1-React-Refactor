import React from 'react';
import satchel from '../../assets/images/ui-elements/satchel.webp';
import caballero from '../../assets/images/ui-elements/Caballero.webp';

function ItemsAndLives({ livesLeft, onSatchelClick, satchelRef }) {
    return (
        <div className="fixed right-4 bottom-6 flex flex-col items-center space-y-2 z-10">
            <div className="flex flex-col space-y-0">
                {Array.from({ length: livesLeft }, (_, i) => (
                    <span key={i} className="block">
                        <img 
                            alt={`Life ${i + 1}`} 
                            src={caballero} 
                            width="45" 
                            height="45"
                            className="drop-shadow-lg hover:scale-105 transition-transform duration-200" 
                        />
                    </span>
                ))}
            </div>
            <button 
                onClick={onSatchelClick} 
                ref={satchelRef} 
                aria-label="Open inventory"
                className="bg-transparent border-2 border-white/20 p-2 rounded-lg
                           hover:bg-gray-700/50 active:bg-gray-600/50
                           transition-all duration-200 transform hover:scale-105 active:scale-95
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
                <img 
                    alt="an image of a satchel" 
                    src={satchel} 
                    width="45" 
                    height="45"
                    className="drop-shadow-lg" 
                />
            </button>
        </div>
    );    
}

export default ItemsAndLives;
