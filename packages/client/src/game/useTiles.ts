import { useTrees } from "./useTrees";

type Tile = {
  x: number;
  y: number;
  tree?: {
    x: number;
    y: number;
    harvested: boolean;
  };
};

function getTiles(xEnd: number, yEnd: number) {
  const tiles: Tile[] = [];
  for (let x = 0; x < xEnd; x++) {
    for (let y = 0; y < yEnd; y++) {
      const tile: Tile = { x, y };
      tiles.push(tile);
    }
  }

  return tiles;
}

const END = 20;

export function useTiles(): Tile[] {
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
