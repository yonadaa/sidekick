export const HarvestSystem = `// SPDX-License-Identifier: MIT
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
`