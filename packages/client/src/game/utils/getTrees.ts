import mudConfig from "contracts/mud.config";
import { stash } from "../../mud/stash";
import { getLazyTrees } from "./getLazyTrees";

export function getTrees(xEnd: number, yEnd: number) {
  const lazyTrees = getLazyTrees(xEnd, yEnd);
  const harvestedTrees = Object.values(
    stash.getRecords({
      table: mudConfig.tables.app__Tree,
    })
  );

  const trees = lazyTrees.map((tree) => {
    const harvested = harvestedTrees.some(
      (harvestedTree) =>
        harvestedTree.x === tree.x && harvestedTree.y === tree.y
    );
    return {
      x: tree.x,
      y: tree.y,
      harvested,
    };
  });

  return trees;
}
