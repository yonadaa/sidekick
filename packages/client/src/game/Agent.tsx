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
import { CheckCheckIcon, Play, RedoDot, Square } from "lucide-react";
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
  const truncateArg = (arg: unknown) => {
    const str = String(arg);
    return str.length > 20 ? `${str.substring(0, 17)}...` : str;
  };

  const truncatedArgs = args.map(truncateArg);
  return `${functionName}(${truncatedArgs.toString()})`;
}

interface StateDisplayProps {
  state: State;
  output?: Output;
  hash?: Hex;
}

function StateDisplay({ state, output, hash }: StateDisplayProps) {
  const renderContent = () => {
    const commonLayout = (
      callDisplay: React.ReactNode,
      checkIconColor: string,
      hashDisplay: React.ReactNode,
      bodyContent: React.ReactNode
    ) => (
      <div>
        <div className="p-2 border-2 h-64 overflow-y-auto whitespace-pre-line">
          {bodyContent}
        </div>
        <div className="flex justify-between p-2 border-2">
          <div className="flex">
            <div className="flex">{callDisplay}</div>
            <CheckCheckIcon className={`ml-2 w-4 ${checkIconColor}`} />
          </div>
          {hashDisplay}
        </div>
      </div>
    );

    const skeletonElement = <Skeleton className="h-4 bg-gray-300 w-32" />;
    const callElement = output ? formatCall(output) : null;
    const hashElement = hash ? <TruncatedHex hex={hash} /> : null;

    switch (state) {
      case State.Empty:
        return commonLayout(
          <Skeleton className="h-4 bg-gray-200 w-32 animate-none" />,
          "text-gray-400",
          <Skeleton className="h-4 bg-gray-200 w-32 animate-none" />,
          "Awaiting input..."
        );
      case State.Idle:
        return commonLayout(
          callElement,
          "text-green-400",
          hashElement,
          output?.chainOfThought
        );
      case State.Thinking:
        return commonLayout(
          skeletonElement,
          "text-gray-400",
          skeletonElement,
          "Thinking..."
        );
      case State.Sending:
        return commonLayout(
          callElement,
          "text-gray-400",
          skeletonElement,
          output?.chainOfThought
        );
      case State.Waiting:
        return commonLayout(
          callElement,
          "text-gray-400",
          hashElement,
          output?.chainOfThought
        );
      default:
        return null;
    }
  };

  return renderContent();
}

export function Agent() {
  const [goal, setGoal] = useState("");
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
    <div className="absolute left-0 top-0 flex flex-col m-2 border-2 w-96 bg-white">
      <div className="flex flex-row">
        <input
          className="flex-grow border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-colors duration-200 bg-white text-gray-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed"
          type="text"
          placeholder="Enter a goal..."
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
          } text-white font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-400 whitespace-nowrap w-11 h-11 flex items-center justify-center`}
          disabled={
            !started &&
            (state === State.Thinking ||
              state === State.Sending ||
              state === State.Waiting)
          }
          onClick={() => setStarted(!started)}
        >
          {started ? <Square size={20} /> : <Play size={24} />}
        </button>
        <button
          title="Step through"
          className="bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-400 whitespace-nowrap w-11 h-11 flex items-center justify-center"
          disabled={
            started ||
            state === State.Thinking ||
            state === State.Sending ||
            state === State.Waiting
          }
          onClick={() => setStep(true)}
        >
          <RedoDot size={24} />
        </button>
      </div>

      <div>
        <StateDisplay state={state} output={output} hash={hash} />
      </div>
    </div>
  );
}
