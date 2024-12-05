import { useGameState } from "../../context/GameStateContext";

const useRemoveLevelSpecificItems = () => {
  const { items, setItems } = useGameState();

  return (level) => {
    const levelItemsMap = {
      1: ["Conch"],
      2: ["Pearl"],
    };

    const levelSpecificItems = levelItemsMap[level] || [];
    const updatedItems = items.filter((item) => !levelSpecificItems.includes(item));
    setItems(updatedItems); // Update state directly
  };
};

export default useRemoveLevelSpecificItems;
