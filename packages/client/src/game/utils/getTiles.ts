type Tile = {
  x: number;
  y: number;
  tree?: {
    x: number;
    y: number;
    harvested: boolean;
  };
};

export function getTiles(xSize: number, ySize: number) {
  const tiles: Tile[] = [];
  const xStart = -Math.floor(xSize / 2);
  const yStart = -Math.floor(ySize / 2);

  for (let x = xStart; x < xStart + xSize; x++) {
    for (let y = yStart; y < yStart + ySize; y++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}
