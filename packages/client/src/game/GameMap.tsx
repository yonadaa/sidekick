import { useAccount } from "wagmi";

import { twMerge } from "tailwind-merge";
import { Direction } from "../common";
import mudConfig from "contracts/mud.config";
import { useAccountModal } from "@latticexyz/entrykit/internal";

import { coordinateHasTree } from "./coordinateHasTree";
import { useTiles } from "./useTiles";
import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";

export type Props = {
  readonly onMove?: (direction: Direction) => Promise<void>;
};

export function GameMap({ onMove }: Props) {
  const { openAccountModal } = useAccountModal();
  const { address: userAddress } = useAccount();

  const players = useRecords({ stash, table: mudConfig.tables.app__Position });
  const currentPlayer = players.find(
    (player) => player.player.toLowerCase() === userAddress?.toLowerCase()
  );

  const tiles = useTiles();

  return (
    <div className="inline-grid p-2 bg-lime-500 relative overflow-hidden">
      {tiles.map((tile) => {
        const { x, y, hasTree, harvested } = tile;

        const player = players.find(
          (player) => player.x === x && player.y === y
        );

        return (
          <div
            key={`${x},${y}`}
            className="w-8 h-8 flex items-center justify-center border border-gray-600"
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
          >
            <div className="flex flex-wrap gap-1 items-center justify-center relative">
              {player ? (
                <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                  🤠
                </div>
              ) : hasTree ? (
                <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                  {harvested ? "🍂" : "🌳"}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
