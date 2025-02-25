// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

import { System } from "@latticexyz/world/src/System.sol";

import { Position, PositionData } from "./codegen/tables/Position.sol";
import { Tree } from "./codegen/tables/Tree.sol";
import { coordinateHasTree } from "./coordinateHasTree.sol";

contract HarvestSystem is System {
  function harvest(int32 x, int32 y) public {
    address player = _msgSender();
    PositionData memory position = Position.get(player);

    require(coordinateHasTree(position.x, position.y), "No tree here");

    Tree.set(position.x, position.y, true);
  }
}
