import React, {useState} from "react";
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';

import { CSS } from "@dnd-kit/utilities";
import CaballeroProfile from "../../../assets/images/portraits/Caballero-Profile.png";
import DraggableConch from "../SortableItems/DraggableConch";


const ConchDrag = () => {
  const [dragCompleted, setDragCompleted] = useState(false);

  const onDragEnd = (event) => {
    const { over } = event;
    if (over && over.id === 'caballeroPortrait') {
      setDragCompleted(true);
    }
  };
  return (
    <div>
      {!dragCompleted && (
        <div>
          <img
          className="environImage"
          src={CaballeroProfile}
          alt="The profile of Caballero's rugged face."
          width="500"
          height="500"
        />
          <p className="standardText"> 
            As you approach her, the Siren flashes you a razor tooth smile and appears to speak, though you still cannot hear her voice. Is the ocean getting louder, or is that sound coming from your satchel?
          </p>
        </div>
      )}
      {/* Narrative Text */}
      <div>
        {dragCompleted && (
          <>
            <p className="standardText">
              Oooouch!! Something slithers down your ear canal, tears through
              your eardrum, and nestles into your cochlea. Overcome with some
              strange euphoria, you hear a beautiful voice singing:
            </p>
            <p className="standardText">
              The Siren speaks, “You are brave, and it is noble of you to seek
              to help your people in this dark age… but if you are to succeed,
              you will need powers beyond your means. Head east and go to the
              Cave of Mirrors, retrieve the Pearl Of The Moon, and free my
              sister, The White Witch. Only she can match the evil that is
              afoot.
            </p>
          </>
        )}
      </div>

      <DndContext onDragEnd={onDragEnd}>
        <DraggableConch id="conchShell" />
        <DroppablePortrait>
        <img src={CaballeroProfile} alt="Caballero's Portrait" width="500" height="500" />
        </DroppablePortrait>
      </DndContext>
    </div>   
  );
};
const DroppablePortrait = ({ children }) => {
  const { setNodeRef } = useDroppable({
    id: 'caballeroPortrait',
  });

  return <div ref={setNodeRef}>{children}</div>;
};
export default ConchDrag;
