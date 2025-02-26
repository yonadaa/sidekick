import { z } from "zod";
import { ChatAnthropic } from "@langchain/anthropic";
import { Address } from "viem";
import { getPrompt, State } from "../../agent/getPrompt";

const Output = z.object({
  chainOfThought: z.string(),
  functionName: z.string(),
  args: z.array(z.any()),
});
export type Output = z.infer<typeof Output>;

const llm = new ChatAnthropic({
  model: "claude-3-5-sonnet-latest",
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
}).withStructuredOutput(Output);

export async function getAction(
  state: State,
  playerAddress: Address,
  goal: string
) {
  const prompt = getPrompt(state, playerAddress, goal);

  const output = await llm.invoke([prompt]);

  return output;
}
