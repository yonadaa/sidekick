import mudConfig from "contracts/mud.config";
import { stash } from "../../mud/stash";
import { getLazyTrees } from "./getLazyTrees";
import { useRecords } from "@latticexyz/stash/react";

export function useTrees(xEnd: number, yEnd: number) {
  const lazyTrees = getLazyTrees(xEnd, yEnd);
  const harvestedTrees = useRecords({
    stash,
    table: mudConfig.tables.app__Tree,
  });

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
}
