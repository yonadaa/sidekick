import mudConfig from "contracts/mud.config";
import { stash } from "../../mud/stash";
import { getLazyTrees } from "./getLazyTrees";

export function getTrees(xSize: number, ySize: number) {
  const lazyTrees = getLazyTrees(xSize, ySize);
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
