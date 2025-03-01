import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { useTiles } from "./utils/useTiles";
import { stash } from "../mud/stash";
import { useGridDimensions } from "./utils/useGridDimensions";
import {
  Address,
  encodeAbiParameters,
  hexToBigInt,
  keccak256,
  parseAbiParameters,
} from "viem";

const EMOJIS = ["🧑‍🌾", "👩‍🌾", "👨‍🌾"];

function getEmoji(address: Address) {
  const hash = keccak256(
    encodeAbiParameters(parseAbiParameters("address"), [address])
  );

  return EMOJIS[Number(hexToBigInt(hash) % 3n)];
}

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
              <div className="relative w-full h-full">
                {tree && (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                    {tree.harvested ? "🍂" : "🌳"}
                  </div>
                )}
                {player && (
                  <>
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm bg-white px-1 rounded border flex items-center"
                      style={{ zIndex: 1 }}
                    >
                      <span>{player.woodBalance.toString()}</span>
                      <span className="ml-0.5">🪵</span>
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center text-2xl"
                      style={{ zIndex: 1 }}
                    >
                      {getEmoji(player.account)}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
