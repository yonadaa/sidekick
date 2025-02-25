import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { stash } from "../mud/stash";
import { coordinateHasTree } from "./coordinateHasTree";

const RANGE = 10;

function getTrees() {
  const trees: { x: number; y: number; harvested: boolean }[] = [];
  for (let x = -RANGE; x < RANGE; x++) {
    for (let y = -RANGE; y < RANGE; y++) {
      if (coordinateHasTree(x, y)) {
        trees.push({ x, y, harvested: false });
      }
    }
  }

  return trees;
}

export const useTrees = () => {
  const trees = getTrees();
  const harvestedTrees = useRecords({
    stash,
    table: mudConfig.tables.app__Tree,
  });

  const gm = trees.map((tree) => {
    return {
      x: tree.x,
      y: tree.y,
      harvested: harvestedTrees.some(
        (harvestedTree) =>
          harvestedTree.x === tree.x && harvestedTree.y === tree.y
      ),
    };
  });

  return gm;
};
