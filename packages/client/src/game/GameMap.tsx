import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { useTiles } from "./utils/useTiles";
import { stash } from "../mud/stash";
import { useGridDimensions } from "./utils/useGridDimensions";

export function GameMap() {
  const players = useRecords({ stash, table: mudConfig.tables.app__Player });
  const { xTiles, yTiles } = useGridDimensions();
  const tiles = useTiles();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="inline-grid bg-lime-500 relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "2rem 2rem",
          backgroundPosition: "0 0",
          width: `${xTiles * 2}rem`,
          height: `${yTiles * 2}rem`,
        }}
      >
        {tiles.map((tile) => {
          const { x, y, tree } = tile;

          const player = players.find(
            (player) => player.x === x && player.y === y
          );

          return (
            <div
              key={`${x},${y}`}
              className="w-8 h-8 flex items-center justify-center"
              style={{
                gridColumn: x + Math.floor(xTiles / 2) + 1,
                gridRow: Math.floor(yTiles / 2) - y,
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
    </div>
  );
}
