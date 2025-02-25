import { GameMap } from "./GameMap";
import mudConfig from "contracts/mud.config";
import { useWorldContract } from "../mud/useWorldContract";
import { useSync } from "@latticexyz/store-sync/react";
import { useMemo } from "react";
import { Direction } from "../common";
import { Spawn } from "./Spawn";
import { twMerge } from "tailwind-merge";
import { ArrowDownIcon } from "../ui/icons/ArrowDownIcon";
import { AsyncButton } from "../ui/AsyncButton";

const rotateClassName = {
  North: "rotate-0",
  East: "rotate-90",
  South: "rotate-180",
  West: "-rotate-90",
} as const satisfies Record<Direction, `${"" | "-"}rotate-${number}`>;

export function Game() {
  const sync = useSync();
  const worldContract = useWorldContract();
  const onMove = useMemo(
    () =>
      sync.data && worldContract
        ? async (direction: Direction) => {
            const tx = await worldContract.write.app__move([
              mudConfig.enums.Direction.indexOf(direction),
            ]);
            await sync.data.waitForTransaction(tx);
          }
        : undefined,
    [sync.data, worldContract]
  );

  const onHarvest = useMemo(
    () =>
      sync.data && worldContract
        ? async () => {
            const tx = await worldContract.write.app__harvest();
            await sync.data.waitForTransaction(tx);
          }
        : undefined,
    [sync.data, worldContract]
  );

  return (
    <div>
      <GameMap />
      <Spawn onMove={onMove} />
      {onHarvest ? (
        <div className="absolute left-0 top-0 grid place-items-center">
          <AsyncButton
            className="group outline-0 p-4 border-4 border-green-400 transition ring-green-300 hover:ring-4 active:scale-95 rounded-lg text-lg font-medium aria-busy:pointer-events-none aria-busy:animate-pulse"
            onClick={() => onHarvest()}
          >
            Harvest<span className="hidden group-aria-busy:inline">ing…</span>
          </AsyncButton>
        </div>
      ) : null}
      {onMove
        ? mudConfig.enums.Direction.map((direction) => (
            <button
              key={direction}
              title={`Move ${direction.toLowerCase()}`}
              className={twMerge(
                "outline-0 absolute inset-0 cursor-pointer grid p-4",
                rotateClassName[direction],
                "transition bg-gradient-to-t from-transparent via-transparent to-blue-50 text-blue-400 opacity-0 hover:opacity-40 active:opacity-100"
              )}
              style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 50%)" }}
              onClick={() => onMove(direction)}
            >
              <ArrowDownIcon className="rotate-180 text-4xl self-start justify-self-center" />
            </button>
          ))
        : null}
    </div>
  );
}
