import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";
import { Address } from "viem";

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
};

const Output = z.object({
  chainOfThought: z.string(),
  functionName: z.string(),
  args: z.array(z.any()),
});
export type Output = z.infer<typeof Output>;

const moveSystem = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Position, PositionData } from "./codegen/tables/Position.sol";

enum Direction {
  North,
  East,
  South,
  West
}

contract MoveSystem is System {
  function move(Direction direction) public {
    address player = _msgSender();
    PositionData memory position = Position.get(player);

    if (direction == Direction.North) {
      position.y += 1;
    } else if (direction == Direction.East) {
      position.x += 1;
    } else if (direction == Direction.South) {
      position.y -= 1;
    } else if (direction == Direction.West) {
      position.x -= 1;
    }

    Position.set(player, position);
  }
}`;

const harvestSystem = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Position, PositionData } from "./codegen/tables/Position.sol";
import { Tree } from "./codegen/tables/Tree.sol";
import { coordinateHasTree } from "./coordinateHasTree.sol";

contract HarvestSystem is System {
  function harvest() public {
    address player = _msgSender();
    PositionData memory position = Position.get(player);

    require(coordinateHasTree(position.x, position.y), "No tree here");
    require(!Tree.get(position.x, position.y), "Tree already harvested");

    Tree.set(position.x, position.y, true);
  }
}`;

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
\`\`\`solidity
${moveSystem}
\`\`\`
\`\`\`solidity
${harvestSystem}
\`\`\`
Your goal:
${goal}`;

  const output = await llm.invoke([content]);

  return output;
}
