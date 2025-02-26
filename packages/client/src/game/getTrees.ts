import mudConfig from "contracts/mud.config";
import { stash } from "../mud/stash";
import { coordinateHasTree } from "./coordinateHasTree";

const RANGE = 20;

function getBase() {
  const trees: { x: number; y: number; harvested: boolean }[] = [];
  for (let x = 0; x < RANGE; x++) {
    for (let y = 0; y < RANGE; y++) {
      if (coordinateHasTree(x, y)) {
        trees.push({ x, y, harvested: false });
      }
    }
  }

  return trees;
}

export const getTrees = () => {
  const trees = getBase();
  const harvestedTrees = Object.values(
    stash.getRecords({
      table: mudConfig.tables.app__Tree,
    })
  );

  const output = trees.map((tree) => {
    return {
      x: tree.x,
      y: tree.y,
      harvested: harvestedTrees.some(
        (harvestedTree) =>
          harvestedTree.x === tree.x && harvestedTree.y === tree.y
      ),
    };
  });

  return output;
};
