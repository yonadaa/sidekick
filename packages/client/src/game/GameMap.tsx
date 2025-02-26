import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { useTiles } from "./utils/useTiles";
import { stash } from "../mud/stash";

export function GameMap() {
  const players = useRecords({ stash, table: mudConfig.tables.app__Player });

  const tiles = useTiles();

  return (
    <div className="inline-grid p-2 bg-lime-500 relative overflow-hidden">
      {tiles.map((tile) => {
        const { x, y, tree } = tile;

        const player = players.find(
          (player) => player.x === x && player.y === y
        );

        return (
          <div
            key={`${x},${y}`}
            className="w-8 h-8 flex items-center justify-center border border-gray-600"
            style={{
              gridColumn: x + 1,
              gridRow: -(y + 1),
            }}
          >
            <div className="flex flex-wrap gap-1 items-center justify-center relative">
              {player ? (
                <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                  🧑‍🌾
                </div>
              ) : tree ? (
                <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                  {tree.harvested ? "🍂" : "🌳"}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
