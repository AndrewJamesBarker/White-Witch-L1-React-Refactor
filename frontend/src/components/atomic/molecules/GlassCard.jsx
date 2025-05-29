import React from 'react';

const GlassCard = ({ children, className = "", ...rest }) => { 
    return (
        <div className={`rounded-2xl bg-black/40 backdrop-blur-xl backdrop-saturate-150 bg-clip-padding border border-white/20 
            shadow-2xl m-4 p-8 ${className}`} {...rest}>
            {children}
        </div>
    )
}

export default GlassCard;