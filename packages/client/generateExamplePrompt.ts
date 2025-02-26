import * as fs from "fs";
import { getPrompt } from "./src/game/agent/getPrompt";

const prompt = getPrompt(
  {
    players: [
      {
        account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        x: 2,
        y: 3,
        woodBalance: 2n,
      },
    ],
    trees: [
      {
        x: 0,
        y: 4,
        harvested: false,
      },
      {
        x: 1,
        y: 3,
        harvested: true,
      },
      {
        x: 2,
        y: 3,
        harvested: true,
      },
      {
        x: 5,
        y: 11,
        harvested: false,
      },
      {
        x: 7,
        y: 14,
        harvested: false,
      },
      {
        x: 8,
        y: 7,
        harvested: false,
      },
      {
        x: 9,
        y: 12,
        harvested: false,
      },
      {
        x: 9,
        y: 18,
        harvested: false,
      },
      {
        x: 10,
        y: 8,
        harvested: false,
      },
      {
        x: 12,
        y: 9,
        harvested: false,
      },
      {
        x: 12,
        y: 11,
        harvested: false,
      },
      {
        x: 13,
        y: 2,
        harvested: false,
      },
      {
        x: 16,
        y: 5,
        harvested: false,
      },
      {
        x: 18,
        y: 12,
        harvested: false,
      },
    ],
  },
  "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "Harvest the closest tree."
);

fs.writeFileSync("./demo/examplePrompt.md", prompt);
