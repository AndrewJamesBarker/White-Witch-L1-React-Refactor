import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import conchShellImage from "../../../assets/images/inventory-items/Conch-Good.png";

const SortableConch = ({ id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none', // Important for preventing scrolling on touch devices while dragging
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <img src={conchShellImage} alt="Conch Shell" width="100" height="100" /> {/* Adjust size as needed */}
    </div>
  );
};

export default SortableConch;
