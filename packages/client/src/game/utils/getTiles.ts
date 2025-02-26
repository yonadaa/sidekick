type Tile = {
  x: number;
  y: number;
  tree?: {
    x: number;
    y: number;
    harvested: boolean;
  };
};

export function getTiles(xEnd: number, yEnd: number) {
  const tiles: Tile[] = [];
  for (let x = 0; x < xEnd; x++) {
    for (let y = 0; y < yEnd; y++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}
