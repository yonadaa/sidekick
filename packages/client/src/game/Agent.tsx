import { useRecords } from "@latticexyz/stash/react";
import { stash } from "../mud/stash";
import { useWorldContract } from "../mud/useWorldContract";
import { AsyncButton } from "../ui/AsyncButton";
import mudConfig from "contracts/mud.config";
import { getAction } from "../agent";
import { useAccount } from "wagmi";
import { useSync } from "@latticexyz/store-sync/react";

export const TREES = [
  {
    x: 1,
    y: 4,
  },
  // {
  //   x: 5,
  //   y: 7,
  // },
];

export function Agent() {
  const sync = useSync();
  const worldContract = useWorldContract();
  const { address: userAddress } = useAccount();

  const players = useRecords({ stash, table: mudConfig.tables.app__Position });
  const currentPlayer = players.find(
    (player) => player.player.toLowerCase() === userAddress?.toLowerCase()
  );

  async function onClick() {
    if (sync.data && worldContract && currentPlayer) {
      const state = {
        players: players.map((player) => ({
          player: player.player,
          x: player.x,
          y: player.y,
        })),
        trees: TREES,
      };
      const action = await getAction(state);

      const tx = await worldContract.write.app__move([action.args[0]]);
      await sync.data.waitForTransaction(tx);
    }
  }

  return (
    <div>
      <div className="absolute right-0 bottom-0 grid place-items-center">
        <AsyncButton
          className="group outline-0 p-4 border-4 border-green-400 transition ring-green-300 hover:ring-4 active:scale-95 rounded-lg text-lg font-medium aria-busy:pointer-events-none aria-busy:animate-pulse"
          onClick={onClick}
        >
          Act<span className="hidden group-aria-busy:inline">ing…</span>
        </AsyncButton>
      </div>
    </div>
  );
}
