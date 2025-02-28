import { stash } from "../mud/stash";
import { useWorldContract } from "../mud/useWorldContract";
import mudConfig from "contracts/mud.config";
import { useAccount } from "wagmi";
import { useSync } from "@latticexyz/store-sync/react";
import { getAction, Output } from "./agent/getAction";
import { useEffect, useState } from "react";
import { getTrees } from "./utils/getTrees";
import { Hex } from "viem";
import { TruncatedHex } from "./TruncatedHex";
import { CheckCheckIcon, Pause, Play, RedoDot } from "lucide-react";
import { Skeleton } from "./Skeleton";

enum State {
  Empty,
  Idle,
  Thinking,
  Sending,
  Waiting,
}

function formatCall({
  functionName,
  args,
}: {
  functionName: string;
  args: unknown[];
}) {
  return `${functionName}(${args.toString()})`;
}

export function Agent() {
  const [goal, setGoal] = useState("Move towards the closest tree.");
  const [state, setState] = useState(State.Empty);
  const [output, setOutput] = useState<Output>();
  const [hash, setHash] = useState<Hex>();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(false);

  const sync = useSync();
  const worldContract = useWorldContract();
  const { address: userAddress } = useAccount();

  useEffect(() => {
    async function doAction() {
      if (
        (state === State.Empty || state === State.Idle) &&
        (started || step) &&
        sync.data &&
        worldContract &&
        userAddress
      ) {
        setState(State.Thinking);

        const players = Object.values(
          stash.getRecords({ table: mudConfig.tables.app__Player })
        );

        const trees = getTrees(20, 20);

        const state = {
          players,
          trees,
        };

        const output = await getAction(state, userAddress, goal);

        setOutput(output);
        setState(State.Sending);

        const functionName = `app__${output.functionName}`;
        // @ts-expect-error functionName is not specific
        const tx: Hex = await worldContract.write[functionName](output.args);

        setHash(tx);
        setState(State.Waiting);

        await sync.data.waitForTransaction(tx);

        setState(State.Idle);
        setStep(false);
      }
    }
    doAction();
  }, [goal, started, state, step, sync.data, userAddress, worldContract]);

  return (
    <div className="absolute left-0 top-0 flex flex-col m-2 border-2 w-96">
      <div className="flex flex-row">
        <input
          className="flex-grow border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
          type="text"
          disabled={
            started ||
            state === State.Thinking ||
            state === State.Sending ||
            state === State.Waiting
          }
          onChange={(event) => setGoal(event.target.value)}
          value={goal}
        />
        <button
          title="Play"
          className={`${
            started
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white font-semibold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-400 whitespace-nowrap`}
          disabled={
            !started &&
            (state === State.Thinking ||
              state === State.Sending ||
              state === State.Waiting)
          }
          onClick={() => setStarted(!started)}
        >
          {started ? <Pause /> : <Play />}
        </button>
        <button
          title="Step through"
          className="bg-blue-400 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-400 whitespace-nowrap"
          disabled={
            started ||
            state === State.Thinking ||
            state === State.Sending ||
            state === State.Waiting
          }
          onClick={() => setStep(true)}
        >
          <RedoDot />
        </button>
      </div>

      <div>
        {state === State.Empty ? (
          <div>
            <div className="flex justify-between p-2 border-2">
              <div className="flex">
                <div>
                  <Skeleton className="h-4 bg-gray-200 w-32 animate-none" />
                </div>
                <CheckCheckIcon className="ml-2 w-4 text-gray-400" />
              </div>
              <div>
                <Skeleton className="h-4 bg-gray-200 w-32 animate-none" />
              </div>
            </div>
            <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
              Awaiting input...
            </div>
          </div>
        ) : state === State.Idle ? (
          <div>
            <div className="flex justify-between p-2 border-2">
              <div className="flex">
                <div className="flex">{output ? formatCall(output) : null}</div>
                <CheckCheckIcon className="ml-2 w-4 text-green-400" />
              </div>
              <TruncatedHex hex={hash as Hex} />
            </div>
            <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
              {output?.chainOfThought}
            </div>
          </div>
        ) : state === State.Thinking ? (
          <div>
            <div className="flex justify-between p-2 border-2">
              <div className="flex">
                <div>
                  <Skeleton className="h-4 bg-gray-300 w-32" />
                </div>
                <CheckCheckIcon className="ml-2 w-4 text-gray-400" />
              </div>
              <div>
                <Skeleton className="h-4 bg-gray-300 w-32" />
              </div>
            </div>
            <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
              Thinking...
            </div>
          </div>
        ) : state === State.Sending ? (
          <div>
            <div className="flex justify-between p-2 border-2">
              <div className="flex">
                <div>{output ? formatCall(output) : null}</div>
                <CheckCheckIcon className="ml-2 w-4 text-gray-400" />
              </div>
              <div>
                <Skeleton className="h-4 bg-gray-300 w-32" />
              </div>
            </div>
            <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
              {output?.chainOfThought}
            </div>
          </div>
        ) : state === State.Waiting ? (
          <div>
            <div className="flex justify-between p-2 border-2">
              <div className="flex">
                <div className="flex">{output ? formatCall(output) : null}</div>
                <CheckCheckIcon className="ml-2 w-4 text-gray-400" />
              </div>
              <TruncatedHex hex={hash as Hex} />
            </div>
            <div className="p-2 border-2" style={{ whiteSpace: "pre-line" }}>
              {output?.chainOfThought}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
