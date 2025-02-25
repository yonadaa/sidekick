import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { stash } from "../mud/stash";
import { coordinateHasTree } from "./coordinateHasTree";

const RANGE = 10;

type Tile = {
  x: number;
  y: number;
  hasTree?: boolean;
  harvested?: boolean;
};

function getTiles() {
  const tiles: Tile[] = [];
  for (let x = -RANGE; x < RANGE; x++) {
    for (let y = -RANGE; y < RANGE; y++) {
      const tile: Tile = { x, y };
      if (coordinateHasTree(x, y)) {
        tile.hasTree = true;
        tile.harvested = false;
      }
      tiles.push(tile);
    }
  }

  return tiles;
}

export function useTiles(): Tile[] {
  const tiles = getTiles();
  const harvestedTrees = useRecords({
    stash,
    table: mudConfig.tables.app__Tree,
  });

  const finishedTiles = tiles.map((tile) => {
    return {
      x: tile.x,
      y: tile.y,
      hasTree: tile.hasTree,
      harvested: harvestedTrees.some(
        (harvestedTree) =>
          harvestedTree.x === tile.x && harvestedTree.y === tile.y
      ),
    };
  });

  return finishedTiles;
}
