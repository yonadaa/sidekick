import { useRecords } from "@latticexyz/stash/react";
import mudConfig from "contracts/mud.config";
import { useTiles } from "./utils/useTiles";
import { stash } from "../mud/stash";
import { useGridDimensions } from "./utils/useGridDimensions";
import { useAccount } from "wagmi";
import {
  Address,
  encodeAbiParameters,
  hexToBigInt,
  keccak256,
  parseAbiParameters,
} from "viem";

const EMOJIS = ["🧑‍🌾", "👩‍🌾", "👨‍🌾"];

// Generate a unique color based on the player's address
function getPlayerColor(address: Address) {
  const hash = keccak256(
    encodeAbiParameters(parseAbiParameters("address"), [address])
  );

  // Simple array of colors that contrast well with the grass
  const colors = [
    "hsl(350, 70%, 65%)", // Pink
    "hsl(200, 70%, 65%)", // Blue
    "hsl(280, 70%, 65%)", // Purple
    "hsl(15, 70%, 65%)", // Orange
    "hsl(320, 70%, 65%)", // Magenta
    "hsl(240, 70%, 65%)", // Indigo
    "hsl(0, 70%, 65%)", // Red
    "hsl(180, 70%, 65%)", // Cyan
  ];

  return colors[Number(hexToBigInt(hash) % BigInt(colors.length))];
}

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
  const { address: userAddress } = useAccount();

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className="inline-grid bg-lime-500 relative overflow-hidden bg-[linear-gradient(to_right,rgba(75,85,99,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(75,85,99,0.2)_1px,transparent_1px)] bg-[length:3rem_3rem] bg-[0_0]"
        style={{
          width: `${xTiles * 3}rem`,
          height: `${yTiles * 3}rem`,
        }}
      >
        {tiles.map((tile) => {
          const { x, y, tree } = tile;

          const player = players.find(
            (player) => player.x === x && player.y === y
          );

          const isCurrentPlayer =
            player?.account.toLowerCase() === userAddress?.toLowerCase();

          return (
            <div
              key={`${x},${y}`}
              className="w-12 h-12 flex items-center justify-center"
              style={{
                gridColumn: x + Math.floor(xTiles / 2) + 1,
                gridRow: Math.floor(yTiles / 2) - y,
              }}
            >
              <div className="relative w-full h-full">
                {tree && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={tree.harvested ? "text-2xl" : "text-5xl"}>
                      {tree.harvested ? "🍂" : "🌳"}
                    </span>
                  </div>
                )}
                {player && (
                  <div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                          isCurrentPlayer
                            ? "scale-110 ring-1 ring-white ring-offset-2 ring-offset-lime-500 shadow-lg"
                            : ""
                        }`}
                        style={{
                          backgroundColor: getPlayerColor(player.account),
                        }}
                      >
                        {getEmoji(player.account)}
                      </div>
                    </div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm bg-white px-1 rounded border flex items-center z-20">
                      <span>{player.woodBalance.toString()}</span>
                      <span className="ml-0.5">🪵</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
