import React, { useState } from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from '@dnd-kit/core';
import "../../../assets/CSS/layout.css";
import { CSS } from "@dnd-kit/utilities";
import conchShellImage from "../../../assets/images/inventory-items/Conch-Good.webp";
import CaballeroProfile from "../../../assets/images/portraits/Caballero-Profile.webp";
import DraggableConch from "../SortableItems/DraggableConch";

const ConchDrag = ({ onDragComplete }) => {
  const [dragCompleted, setDragCompleted] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);

  const onDragStart = (event) => {
    setDraggedItemId(event.active.id);
  };

  const onDragEnd = (event) => {
    setDraggedItemId(null);
    const { over } = event;
    if (over && over.id === 'caballeroPortrait') {
      setDragCompleted(true);
      onDragComplete();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setDraggedItemId('conchShell');
    } else if (event.key === ' ') {
      onDragEnd({ active: { id: 'conchShell' }, over: { id: 'caballeroPortrait' } });
    }
  };

  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="dragAndDropContainer">
        <DragTarget>
          <img 
            src={CaballeroProfile} 
            alt="Caballero's Portrait" 
            width="300" 
            height="300" 
            tabIndex="0"
            role="button"
            aria-label="Drop area for the conch shell"
            onKeyDown={handleKeyDown}
          />
        </DragTarget>
        {!dragCompleted && draggedItemId !== 'conchShell' && 
          <DraggableConch 
            id="conchShell" 
            tabIndex="0"
            role="button"
            aria-label="Draggable conch shell, press enter to pick up and space to drop on the portrait."
            onKeyDown={handleKeyDown}
          />}
      </div>
      <DragOverlay>
        {draggedItemId === 'conchShell' && (
          <img 
            className="conchDraggable" 
            src={conchShellImage} 
            alt="Conch Shell"  
            style={{ width: '150px', height: '150px', cursor: 'pointer', touchAction: 'none' }} 
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

const DragTarget = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'caballeroPortrait',
  });

  return <div ref={setNodeRef}>{children}</div>;
};

export default ConchDrag;
