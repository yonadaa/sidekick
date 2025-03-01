// SPDX-License-Identifier: MIT
pragma solidity >=0.8.24;

uint256 constant TREE_PROBABILITY_DIVISOR = 100;
uint256 constant TREE_PROBABILITY_COMPARATOR = 7;

function coordinateHasTree(int32 x, int32 y) pure returns (bool) {
  bytes32 hash = keccak256(abi.encode(x, y));
  return uint256(hash) % TREE_PROBABILITY_DIVISOR < TREE_PROBABILITY_COMPARATOR;
}
