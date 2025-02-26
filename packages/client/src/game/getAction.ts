import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";
import { Address } from "viem";
import { harvestSystem } from "./harvestSystem";
import { moveSystem } from "./moveSystem";
import { systems } from "./systems";

type State = {
  players: {
    player: Address;
    x: number;
    y: number;
  }[];
  trees: {
    x: number;
    y: number;
  }[];
  woods: {
    player: Address;
    balance: string;
  }[];
};

const Output = z.object({
  chainOfThought: z.string(),
  functionName: z.string(),
  args: z.array(z.any()),
});
export type Output = z.infer<typeof Output>;

const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
}).withStructuredOutput(Output);

export async function getAction(
  state: State,
  playerAddress: Address,
  goal: string
) {
  const content = `
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

  console.log(content);

  const output = await llm.invoke([content]);

  return output;
}
