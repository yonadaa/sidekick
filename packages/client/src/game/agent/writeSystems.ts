import { writeSystem } from "./writeSystem";

const systems = ["MoveSystem", "HarvestSystem", "StealSystem"];

function writeSystems(systems: string[]) {
  systems.map((name) => writeSystem(name));
}

writeSystems(systems);
