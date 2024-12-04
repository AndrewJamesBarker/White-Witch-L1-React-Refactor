import { useGameState } from "../../context/GameStateContext";

const useRemoveLevelSpecificItems = () => {
  const { items, setItems, updateItem } = useGameState();

  const removeLevelSpecificItems = (level) => {
    const levelItemsMap = {
      1: ["Conch"], // Items specific to Chapter 1
      2: ["Pearl"], // Items specific to Chapter 2
      // Add more levels and their specific items
    };

    const levelSpecificItems = levelItemsMap[level] || [];
    const updatedItems = items.filter(item => !levelSpecificItems.includes(item));

    // Update the context with the new items
    setItems(updatedItems);

    // Optionally, persist the updated items in the database
    updatedItems.forEach(item => updateItem(item));

    return updatedItems; // Return the updated items for optional use
  };

  return removeLevelSpecificItems;
};

export default useRemoveLevelSpecificItems;
