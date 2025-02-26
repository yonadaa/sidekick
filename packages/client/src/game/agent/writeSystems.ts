import { writeSystem } from "./writeSystem";

function writeSystems(systems: string[]) {
  systems.map((name) => writeSystem(name));
}

const systems = ["MoveSystem", "HarvestSystem"];
writeSystems(systems);
