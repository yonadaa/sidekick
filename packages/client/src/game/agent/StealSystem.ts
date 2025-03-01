export const StealSystem = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Player, PlayerData } from "./codegen/tables/Player.sol";

function getManhattanDistance(PlayerData memory a, PlayerData memory b) pure returns (int32) {
  int32 xDiff = a.x > b.x ? a.x - b.x : b.x - a.x;
  int32 yDiff = a.y > b.y ? a.y - b.y : b.y - a.y;
  return xDiff + yDiff;
}

contract StealSystem is System {
  function steal(address targetAccount) public {
    address account = _msgSender();
    PlayerData memory player = Player.get(account);
    PlayerData memory target = Player.get(targetAccount);

    require(getManhattanDistance(player, target) <= 1, "Target is too far away");

    uint256 targetBalance = Player.getWoodBalance(targetAccount);
    Player.setWoodBalance(targetAccount, 0);
    Player.setWoodBalance(account, Player.getWoodBalance(account) + targetBalance);
  }
}
`