import { Address } from "viem";
import { GetRecordsResult } from "@latticexyz/stash/internal";
import mudConfig from "contracts/mud.config";
import { systems } from "../src/game/systems";

export type State = {
  players: GetRecordsResult<
    typeof mudConfig.tables.app__Player
  >[keyof typeof mudConfig.tables.app__Player][];
  trees: GetRecordsResult<
    typeof mudConfig.tables.app__Tree
  >[keyof typeof mudConfig.tables.app__Tree][];
};

export function getPrompt(state: State, playerAddress: Address, goal: string) {
  state.players.map(
    //@ts-expect-error readonly property
    (player) => (player.woodBalance = player.woodBalance.toString())
  );

  return `
Your task is to control a player in a game. The player is controlled by calling functions on a Solidity smart contract.
You will be given some goal, and the current state of the game. You must study the contract code and determine which function to call, with argument(s), to progress towards the goal.

Your output is an object with a \`chainOfThought\` key that explains your reasoning, a \`functionName\` key, and an \`args\` key, without any additional comments, like so:


\`\`\`ts
{
  chainOfThought: string;
  functionName: string;
  args: any[];
}
\`\`\`

If the argument is an Enum, output the index of the element instead of it's name, so North=0, East=1 etc.

Your player address:
${playerAddress}

Game state:
\`\`\`json
${JSON.stringify(state)}
\`\`\`

Smart contract functions:
${systems
  .map(
    (system) => `\`\`\`solidity
${system}
\`\`\``
  )
  .join("\n")}
Your goal:
${goal}`;
}
