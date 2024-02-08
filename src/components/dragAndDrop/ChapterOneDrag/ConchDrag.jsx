import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CaballeroProfile from "../../../assets/images/portraits/Caballero-Profile.png";
import SortableConch from "../SortableItems/SortableConch"; 

const ConchDrag = ({ items, onDragEnd, conchListened }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div>
      {/* Narrative Text */}
      <div>
        <img
          className="environImage"
          src={CaballeroProfile}
          alt="The profile of Caballero's rugged face."
          width="500"
          height="500"
        />
        {conchListened && (
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
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(id => (
            <SortableConch key={id} id={id} />
          ))}
        </SortableContext>
      </DndContext>

    </div>
  );
};

export default ConchDrag;
