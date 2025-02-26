import { useAccount } from "wagmi";
import { useRecords } from "@latticexyz/stash/react";
import { AsyncButton } from "../ui/AsyncButton";
import { stash } from "../mud/stash";
import { useAccountModal } from "@latticexyz/entrykit/internal";
import mudConfig from "contracts/mud.config";
import { Direction } from "../common";

export function Spawn({
  onMove,
}: {
  onMove: ((direction: Direction) => Promise<void>) | undefined;
}) {
  const { openAccountModal } = useAccountModal();
  const { address: userAddress } = useAccount();

  const players = useRecords({ stash, table: mudConfig.tables.app__Position });
  const currentPlayer = players.find(
    (player) => player.player.toLowerCase() === userAddress?.toLowerCase()
  );

  return (
    <div>
      {!currentPlayer ? (
        onMove ? (
          <div className="absolute inset-0 grid place-items-center">
            <AsyncButton
              className="group outline-0 p-4 border-4 border-green-400 transition ring-green-300 hover:ring-4 active:scale-95 rounded-lg text-lg font-medium aria-busy:pointer-events-none aria-busy:animate-pulse bg-white"
              onClick={() => onMove("North")}
            >
              Spawn<span className="hidden group-aria-busy:inline">ing…</span>
            </AsyncButton>
          </div>
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <button
              className="group outline-0 p-4 border-4 border-green-400 transition ring-green-300 hover:ring-4 active:scale-95 rounded-lg text-lg font-medium aria-busy:pointer-events-none aria-busy:animate-pulse bg-white"
              onClick={openAccountModal}
            >
              Sign in to play
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}
