import mudConfig from "contracts/mud.config";
import { stash } from "../mud/stash";
import { getLazyTrees } from "./getLazyTrees";

export const getTrees = () => {
  const lazyTrees = getLazyTrees(20, 20);
  const harvestedTrees = Object.values(
    stash.getRecords({
      table: mudConfig.tables.app__Tree,
    })
  );

  const trees = lazyTrees.map((tree) => {
    const harvested = harvestedTrees.some(
      (harvestedTree) =>
        harvestedTree.harvested &&
        harvestedTree.x === tree.x &&
        harvestedTree.y === tree.y
    );
    return {
      x: tree.x,
      y: tree.y,
      harvested,
    };
  });

  return trees;
};
