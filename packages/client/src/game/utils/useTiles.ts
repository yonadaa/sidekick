import { getTiles } from "./getTiles";
import { useTrees } from "./useTrees";

const X_END = 40;
const Y_END = 20;
export function useTiles() {
  const tiles = getTiles(X_END, Y_END);
  const trees = useTrees(X_END, Y_END);

  const finishedTiles = tiles.map((tile) => {
    return {
      x: tile.x,
      y: tile.y,
      tree: trees.find((tree) => tree.x === tile.x && tree.y === tile.y),
    };
  });

  return finishedTiles;
}
