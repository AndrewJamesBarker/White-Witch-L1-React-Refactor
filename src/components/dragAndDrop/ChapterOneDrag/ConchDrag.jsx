import React, {useState} from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from '@dnd-kit/core';

import { CSS } from "@dnd-kit/utilities";
import conchShellImage from "../../../assets/images/inventory-items/Conch-Good.png";
import CaballeroProfile from "../../../assets/images/portraits/Caballero-Profile.png";
import DraggableConch from "../SortableItems/DraggableConch";


const ConchDrag = ({ onDragComplete }) => {
  const [dragCompleted, setDragCompleted] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);

  const onDragStart = (event) => {
    setDraggedItemId(event.active.id);
  }

  const onDragEnd = (event) => {
    setDraggedItemId(null);
    const { over } = event;
    if (over && over.id === 'caballeroPortrait') {
      setDragCompleted(true);
      onDragComplete();
    }
  };
  return (
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <DroppablePortrait>
        <img src={CaballeroProfile} alt="Caballero's Portrait" width="300" height="300" />
        </DroppablePortrait>
        {!dragCompleted && draggedItemId !== 'conchShell' && <DraggableConch id="conchShell" />}

        <DragOverlay>
          {draggedItemId === 'conchShell' && (
            <img src={conchShellImage} alt="Conch Shell"  style={{ width: '150px', height: '150px' }} />
          )}
        </DragOverlay>
      </DndContext> 
  );
};


const DroppablePortrait = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'caballeroPortrait',
  });

  return <div ref={setNodeRef}>{children}</div>;
};
export default ConchDrag;
