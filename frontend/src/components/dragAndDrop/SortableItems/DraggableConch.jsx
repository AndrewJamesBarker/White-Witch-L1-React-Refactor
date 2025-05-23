import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import "../../../assets/CSS/layout.css";
import "../../../assets/CSS/images.css";
import conchShellImage from "../../../assets/images/inventory-items/Conch-Good.webp";

const DraggableConch = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useDraggable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none', // Important for preventing scrolling on touch devices while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img className='objectPulse conchDraggable' src={conchShellImage} alt="Conch Shell" width="150" height="150" />
    </div>
  );
};

export default DraggableConch;
