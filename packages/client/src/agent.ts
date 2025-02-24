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

contract MoveSystem is System {
  function move(uint8 direction) public {
    address player = _msgSender();
    PositionData memory position = Position.get(player);

    if (direction == 0) {
      position.y += 1;
    } else if (direction == 1) {
      position.x += 1;
    } else if (direction == 2) {
      position.y -= 1;
    } else if (direction == 3) {
      position.x -= 1;
    }

    Position.set(player, position);
  }
}`;

const Call = z.object({
  functionName: z.string(),
  args: z.array(z.number()),
});
type Call = z.infer<typeof Call>;

const llm = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
}).withStructuredOutput(Call);

export async function getAction(state: State) {
  const content = `Your task is to control a player in an onchain game. Given the current game state, a set of actions, and some goal, you must output the action you would take in the form of a function call, like so, without any additional comments.

{
  functionName: string,
  args: any[],
}

Your goal is to move to the closest tree.
  
Here is the game state:
  
${JSON.stringify(state)}

Here are the actions you can take, represented as functions in a Solidity smart contract:

\`\`\`solidity
${contract}
\`\`\``;
  console.log(content);

  const call = await llm.invoke([content]);
  console.log(call);

  return call;
}
