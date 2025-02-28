import { useEffect } from "react";
import { Address } from "viem";
import mudConfig from "contracts/mud.config";
import { Direction } from "../common";
import { stash } from "../mud/stash";
import { useAccount } from "wagmi";

const keys = new Map<KeyboardEvent["key"], Direction>([
  ["ArrowUp", "North"],
  ["ArrowRight", "East"],
  ["ArrowDown", "South"],
  ["ArrowLeft", "West"],
]);

export const useKeyboardMovement = (
  onMove: undefined | ((direction: Direction) => void),
  onHarvest: undefined | (() => void),
  onSteal: undefined | ((target: Address) => void)
) => {
  const { address: userAddress } = useAccount();

  useEffect(() => {
    if (!onMove) return;
    if (!onHarvest) return;
    if (!onSteal) return;

    const keyListener = (event: KeyboardEvent) => {
      // Ignore keyboard events when an input element is focused
      if (event.target instanceof HTMLInputElement) return;

      if (event.key === " ") {
        event.preventDefault(); // Prevent spacebar from scrolling
        onHarvest();
      } else if (event.key === "k") {
        const players = Object.values(
          stash.getRecords({ table: mudConfig.tables.app__Player })
        );
        const currentPlayer = players.find(
          (player) =>
            player.account.toLowerCase() === userAddress?.toLowerCase()
        );
        if (currentPlayer) {
          const target = players.find(
            (player) =>
              player.x === currentPlayer.x && player.y === currentPlayer.y
          );
          if (target) {
            onSteal(target.account);
          }
        }
      }
      const direction = keys.get(event.key);
      if (direction == null) return;

      event.preventDefault();
      onMove(direction);
    };

    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [onMove, onHarvest, onSteal, userAddress]);
};
