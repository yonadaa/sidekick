import { Chain, http, webSocket } from "viem";
import { anvil, base } from "viem/chains";
import { createWagmiConfig } from "@latticexyz/entrykit/internal";
import { rhodolite, garnet, redstone } from "@latticexyz/common/chains";
import { chainId } from "./common";

export const chains = [
  redstone,
  garnet,
  rhodolite,
  {
    ...base,
    rpcUrls: {
      ...base.rpcUrls,
      bundler: {
        http: [import.meta.env.VITE_BASE_RPC_URL],
      },
    },
  },
  {
    ...anvil,
    contracts: {
      ...anvil.contracts,
      paymaster: {
        address: "0x2FAEB0760D4230Ef2aC21496Bb4F0b47D634FD4c",
      },
    },
    blockExplorers: {
      default: {} as never,
      worldsExplorer: {
        name: "MUD Worlds Explorer",
        url: "http://localhost:13690/anvil/worlds",
      },
    },
  },
] as const satisfies Chain[];

export const transports = {
  [anvil.id]: webSocket(),
  [garnet.id]: http(),
  [rhodolite.id]: http(),
  [redstone.id]: http(),
  [base.id]: http(),
} as const;

export const wagmiConfig = createWagmiConfig({
  chainId,
  // TODO: swap this with another default project ID or leave empty
  walletConnectProjectId: "14ce88fdbc0f9c294e26ec9b4d848e44",
  appName: document.title,
  chains,
  transports,
  pollingInterval: {
    [anvil.id]: 2000,
    [garnet.id]: 2000,
    [rhodolite.id]: 2000,
    [redstone.id]: 2000,
    [base.id]: 2000,
  },
});
