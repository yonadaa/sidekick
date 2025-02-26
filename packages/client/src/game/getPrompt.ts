import { Address } from "viem";
import { systems } from "./systems";

export type State = {
  players: {
    player: Address;
    x: number;
    y: number;
  }[];
  trees: {
    x: number;
    y: number;
    harvested: boolean;
  }[];
  woods: {
    player: Address;
    balance: string;
  }[];
};

export function getPrompt(state: State, playerAddress: Address, goal: string) {
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
