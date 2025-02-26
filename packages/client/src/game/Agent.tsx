import { stash } from "../mud/stash";
import { useWorldContract } from "../mud/useWorldContract";
import { AsyncButton } from "../ui/AsyncButton";
import mudConfig from "contracts/mud.config";
import { useAccount } from "wagmi";
import { useSync } from "@latticexyz/store-sync/react";
import { getAction, Output } from "./getAction";
import { useState } from "react";
import { getTrees } from "./getTrees";

export function Agent() {
  const [goal, setGoal] = useState("Move towards the closest tree.");
  const [output, setOutput] = useState<Output>();

  const sync = useSync();
  const worldContract = useWorldContract();
  const { address: userAddress } = useAccount();

  async function onClick() {
    const trees = getTrees();

    const players = Object.values(
      stash.getRecords({ table: mudConfig.tables.app__Position })
    );

    const woods = Object.values(
      stash.getRecords({ table: mudConfig.tables.app__Wood })
    ).map((wood) => ({
      player: wood.player,
      balance: wood.balance.toString(),
    }));

    if (sync.data && worldContract && userAddress) {
      const state = {
        players: players.map((player) => ({
          player: player.player,
          x: player.x,
          y: player.y,
        })),
        trees,
        woods,
      };

      const output = await getAction(state, userAddress, goal);

      if (output.functionName === "move") {
        const tx = await worldContract.write.app__move(output.args as [number]);
        await sync.data.waitForTransaction(tx);
      }
      if (output.functionName === "harvest") {
        const tx = await worldContract.write.app__harvest();
        await sync.data.waitForTransaction(tx);
      }

      setOutput(output);
    }
  }

  return (
    <div className="absolute left-0 top-0 flex flex-col m-2 border-2 w-96">
      <div className="flex flex-row ">
        <form className="bg-white shadow-md rounded">
          <input
            className="shadow appearance-none border rounded py-2 px-3 h-16 w-72 text-gray-700 focus:outline-none focus:shadow-outline"
            type="text"
            onChange={(event) => {
              setGoal(event.target.value);
            }}
            value={goal}
          />
        </form>
        <AsyncButton
          className="group outline-0 p-4 border-4 border-green-400 transition ring-green-300 hover:ring-4 active:scale-95 rounded-lg font-medium aria-busy:pointer-events-none aria-busy:animate-pulse"
          onClick={onClick}
        >
          Act<span className="hidden group-aria-busy:inline">ing…</span>
        </AsyncButton>
      </div>
      {output ? (
        <div>
          <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
            {output.chainOfThought}
          </div>
          <div className="p-2 border-2">
            <div>{`functionName: ${output.functionName}`}</div>
            <div>{`args: [${output.args.toString()}]`}</div>
          </div>
        </div>
      ) : (
        <div>
          <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
            ...
          </div>
          <div className="p-2 border-2">
            <div>{`functionName: ...`}</div>
            <div>{`args: ...`}</div>
          </div>
        </div>
      )}
    </div>
  );
}
