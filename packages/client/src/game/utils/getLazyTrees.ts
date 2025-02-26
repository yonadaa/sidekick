import { coordinateHasTree } from "./coordinateHasTree";

type LazyTree = {
  x: number;
  y: number;
  harvested: false;
};

export function getLazyTrees(xEnd: number, yEnd: number) {
  const lazyTrees: LazyTree[] = [];
  for (let x = 0; x < xEnd; x++) {
    for (let y = 0; y < yEnd; y++) {
      if (coordinateHasTree(x, y)) {
        lazyTrees.push({ x, y, harvested: false });
      }
    }
  }

  return lazyTrees;
}
