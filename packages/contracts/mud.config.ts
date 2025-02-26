import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  enums: {
    Direction: ["North", "East", "South", "West"],
  },
  tables: {
    Player: {
      schema: { account: "address", x: "int32", y: "int32", woodBalance: "uint256" },
      key: ["account"],
    },
    Tree: {
      schema: { x: "int32", y: "int32", harvested: "bool" },
      key: ["x", "y"],
    },
  },
});
