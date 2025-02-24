import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";

const Coordinate = z.object({
  x: z.number(),
  y: z.number(),
});

const State = z.object({
  player: Coordinate,
  trees: z.array(Coordinate),
});
type State = z.infer<typeof State>;

const contract = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Direction } from "./codegen/common.sol";
import { Position, PositionData } from "./codegen/tables/Position.sol";

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
type Call = z.infer<typeof Call>;

const llm = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
}).withStructuredOutput(Call);

export async function getAction(state: State) {
  const content = `You are a player in a videogame. Here is the game state:
  
  ${JSON.stringify(state)}

  The actions you can take are represented as functions on the following Solidity smart contract:

  <code>
  ${contract}
  </code>
  
  Your goal is to move to the closest tree. Output the action you would take in the form of a function call, with the \`functionName\` and \`args\`, with any additional comments.`;

  const call = await llm.invoke([content]);

  return call;
}
