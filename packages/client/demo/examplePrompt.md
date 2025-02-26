
Your task is to control a player in a game. The player is controlled by calling functions on a Solidity smart contract.
You will be given some goal, and the current state of the game. You must study the contract code and determine which function to call, with argument(s), to progress towards the goal.

Your output is an object with a `chainOfThought` key that explains your reasoning, a `functionName` key, and an `args` key, without any additional comments, like so:


```ts
{
  chainOfThought: string;
  functionName: string;
  args: any[];
}
```

If the argument is an Enum, output the index of the element instead of it's name, so North=0, East=1 etc.

Your player address:
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

Game state:
```json
{"players":[{"account":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","x":2,"y":3,"woodBalance":"2"}],"trees":[{"x":0,"y":4,"harvested":false},{"x":1,"y":3,"harvested":true},{"x":2,"y":3,"harvested":true},{"x":5,"y":11,"harvested":false},{"x":7,"y":14,"harvested":false},{"x":8,"y":7,"harvested":false},{"x":9,"y":12,"harvested":false},{"x":9,"y":18,"harvested":false},{"x":10,"y":8,"harvested":false},{"x":12,"y":9,"harvested":false},{"x":12,"y":11,"harvested":false},{"x":13,"y":2,"harvested":false},{"x":16,"y":5,"harvested":false},{"x":18,"y":12,"harvested":false}]}
```

Smart contract functions:
```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerData } from "./codegen/tables/Player.sol";
import { Direction } from "./codegen/common.sol";

contract MoveSystem is System {
  function move(Direction direction) public {
    address account = _msgSender();

    if (direction == Direction.North) {
      Player.setY(account, Player.getY(account) + 1);
    } else if (direction == Direction.East) {
      Player.setX(account, Player.getX(account) + 1);
    } else if (direction == Direction.South) {
      Player.setY(account, Player.getY(account) - 1);
    } else if (direction == Direction.West) {
      Player.setX(account, Player.getX(account) - 1);
    }
  }
}

```
```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Player, PlayerData } from "./codegen/tables/Player.sol";
import { Tree } from "./codegen/tables/Tree.sol";
import { coordinateHasTree } from "./coordinateHasTree.sol";

contract HarvestSystem is System {
  function harvest() public {
    address account = _msgSender();
    PlayerData memory player = Player.get(account);

    require(coordinateHasTree(player.x, player.y), "No tree here");
    require(!Tree.get(player.x, player.y), "Tree already harvested");

    Tree.set(player.x, player.y, true);
    Player.setWoodBalance(account, Player.getWoodBalance(account) + 1);
  }
}

```
Your goal:
Harvest the closest tree.