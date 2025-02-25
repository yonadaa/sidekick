import { serialize, useAccount } from "wagmi";
import { Address, Hex, hexToBigInt, keccak256 } from "viem";
import { ArrowDownIcon } from "../ui/icons/ArrowDownIcon";
import { twMerge } from "tailwind-merge";
import { Direction } from "../common";
import mudConfig from "contracts/mud.config";
import { AsyncButton } from "../ui/AsyncButton";
import { useAccountModal } from "@latticexyz/entrykit/internal";
import { Agent } from "./Agent";
import { useTrees } from "./useTrees";
import { coordinateHasTree } from "./coordinateHasTree";
import { useTiles } from "./useTiles";

export type Props = {
  readonly players?: readonly {
    readonly player: Address;
    readonly x: number;
    readonly y: number;
  }[];

  readonly onMove?: (direction: Direction) => Promise<void>;
};

const RANGE = 10;

function getTiles() {
  const trees: { x: number; y: number; harvested: boolean }[] = [];
  for (let x = -RANGE; x < RANGE; x++) {
    for (let y = -RANGE; y < RANGE; y++) {
      if (coordinateHasTree(x, y)) {
        trees.push({ x, y, harvested: false });
      }
      trees.push({ x, y, harvested: false });
    }
  }

  return trees;
}

export function GameMap({ players = [], onMove }: Props) {
  const { openAccountModal } = useAccountModal();
  const { address: userAddress } = useAccount();
  const currentPlayer = players.find(
    (player) => player.player.toLowerCase() === userAddress?.toLowerCase()
  );

  const tiles = useTiles();

  return (
    <div className="inline-grid p-2 bg-lime-500 relative overflow-hidden">
      {tiles.map((tile) => {
        const { x, y, hasTree, harvested } = tile;

        return (
          <div
            key={`${x},${y}`}
            className={twMerge("w-8 h-8 flex items-center justify-center")}
            style={{
              gridColumn: x + 1,
              gridRow: y + 1,
            }}
          >
            <div className="flex flex-wrap gap-1 items-center justify-center relative">
              {hasTree ? (
                <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none">
                  🌳
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
