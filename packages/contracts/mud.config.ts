import { defineWorld } from "@latticexyz/world";

export default defineWorld({
  namespace: "app",
  enums: {
    Direction: ["North", "East", "South", "West"],
  },
  tables: {
    Position: {
      schema: { player: "address", x: "int32", y: "int32" },
      key: ["player"],
    },
    Tree: {
      schema: { x: "int32", y: "int32", harvested: "bool" },
      key: ["x", "y"],
    },
  },
});
