import { coordinateHasTree } from "./coordinateHasTree";

export function getLazyTrees(xEnd: number, yEnd: number) {
  const trees: { x: number; y: number; harvested: boolean }[] = [];
  for (let x = 0; x < xEnd; x++) {
    for (let y = 0; y < yEnd; y++) {
      if (coordinateHasTree(x, y)) {
        trees.push({ x, y, harvested: false });
      }
    }
  }

  return trees;
}
