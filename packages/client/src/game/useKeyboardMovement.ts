import { useEffect } from "react";
import { Direction } from "../common";

const keys = new Map<KeyboardEvent["key"], Direction>([
  ["ArrowUp", "North"],
  ["ArrowRight", "East"],
  ["ArrowDown", "South"],
  ["ArrowLeft", "West"],
]);

export const useKeyboardMovement = (
  onMove: undefined | ((direction: Direction) => void),
  onHarvest: undefined | (() => void)
) => {
  useEffect(() => {
    if (!onMove) return;
    if (!onHarvest) return;

    const listener = (event: KeyboardEvent) => {
      if (event.key === " ") {
        onHarvest();
      }
      const direction = keys.get(event.key);
      if (direction == null) return;

      event.preventDefault();
      onMove(direction);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [onMove, onHarvest]);
};
