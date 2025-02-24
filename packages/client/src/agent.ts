import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";

const Coordinate = z.object({
  x: z.number(),
  y: z.number(),
});

const State = z.object({
  players: z.array(
    z.object({
      player: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
  trees: z.array(Coordinate),
});
type State = z.infer<typeof State>;

const contract = `// SPDX-License-Identifier: MIT
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

const Call = z.object({
  functionName: z.string(),
  args: z.array(z.any()),
});

const Output = z.object({
  chainOfThought: z.string(),
  call: Call,
});

const llm = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
}).withStructuredOutput(Output);

export async function getAction(state: State) {
  const content = `Your task is to control a player in a game. This game is onchain, meaning the game logic is represented by a Solidity smart contract.
Your task is to study the contract code and determine which function to call, with argument(s), given the current game state and some goal.

Your output is an object with a \`chainOfThought\` key that explains your reasoning, and a function call, without any additional comments, like so:


{
  chainOfThought: string;
  call: {
    functionName: string;
    args: any[];
  }
}

Game state:

${JSON.stringify(state)}

Smart contract functions:

\`\`\`solidity
${contract}
\`\`\`

Your goal:

Move towards the tree that is closest to the player.`;

  const output = await llm.invoke([content]);
  console.log(output);

  return output.call;
}
