import { coordinateHasTree } from "./coordinateHasTree";

type LazyTree = {
  x: number;
  y: number;
  harvested: false;
};

export function getLazyTrees(xSize: number, ySize: number) {
  const lazyTrees: LazyTree[] = [];
  const xStart = -Math.floor(xSize / 2);
  const yStart = -Math.floor(ySize / 2);

  for (let x = xStart; x < xStart + xSize; x++) {
    for (let y = yStart; y < yStart + ySize; y++) {
      if (coordinateHasTree(x, y)) {
        lazyTrees.push({ x, y, harvested: false });
      }
    }
  }

  return lazyTrees;
}
