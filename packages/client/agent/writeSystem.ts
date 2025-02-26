import * as fs from "fs";

function renderSystem(name: string) {
  const source = fs.readFileSync(`../contracts/src/${name}.sol`);

  return `export const ${name} = \`${source.toString()}\``;
}

export function writeSystem(name: string) {
  const content = renderSystem(name);

  fs.writeFileSync(`./src/game/${name}.ts`, content);
}
