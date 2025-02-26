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
