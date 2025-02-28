import { getTiles } from "./getTiles";
import { useTrees } from "./useTrees";
import { useGridDimensions } from "./useGridDimensions";

export function useTiles() {
  const { xTiles, yTiles } = useGridDimensions();
  const tiles = getTiles(xTiles, yTiles);
  const trees = useTrees(xTiles, yTiles);

  const finishedTiles = tiles.map((tile) => {
    return {
      x: tile.x,
      y: tile.y,
      tree: trees.find((tree) => tree.x === tile.x && tree.y === tile.y),
    };
  });

  return finishedTiles;
}
