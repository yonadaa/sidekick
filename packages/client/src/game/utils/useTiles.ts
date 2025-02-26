import { getTiles } from "./getTiles";
import { useTrees } from "./useTrees";

const END = 20;

export function useTiles() {
  const tiles = getTiles(END, END);
  const trees = useTrees(END, END);

  const finishedTiles = tiles.map((tile) => {
    return {
      x: tile.x,
      y: tile.y,
      tree: trees.find((tree) => tree.x === tile.x && tree.y === tile.y),
    };
  });

  return finishedTiles;
}
