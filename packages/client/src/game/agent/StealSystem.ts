export const StealSystem = `// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";
import { Player, PlayerData } from "./codegen/tables/Player.sol";

contract StealSystem is System {
  function steal(address targetAccount) public {
    address account = _msgSender();
    PlayerData memory player = Player.get(account);
    PlayerData memory target = Player.get(targetAccount);

    require(player.x == target.x && player.y == target.y, "Player not at these coordinates");

    Player.setWoodBalance(account, player.woodBalance + target.woodBalance);
    Player.setWoodBalance(targetAccount, 0);
  }
}
`