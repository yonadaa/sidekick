import {
  encodeAbiParameters,
  hexToBigInt,
  keccak256,
  parseAbiParameters,
} from "viem";

const TREE_PROBABILITY_DIVISOR = 100n;
const TREE_PROBABILITY_COMPARATOR = 3n;

export function coordinateHasTree(x: number, y: number) {
  const hash = keccak256(
    encodeAbiParameters(parseAbiParameters("int32, int32"), [x, y])
  );

  return (
    hexToBigInt(hash) % TREE_PROBABILITY_DIVISOR < TREE_PROBABILITY_COMPARATOR
  );
}
