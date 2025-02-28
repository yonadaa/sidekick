import { useRecords } from "@latticexyz/stash/react";
import { useAccount } from "wagmi";
import { stash } from "../mud/stash";
import mudConfig from "contracts/mud.config";

export function WoodBalance() {
  const { address: userAddress } = useAccount();
  const players = useRecords({ stash, table: mudConfig.tables.app__Player });
  const currentPlayer = players.find(
    (player) => player.account.toLowerCase() === userAddress?.toLowerCase()
  );

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 m-2 border-2 bg-white px-4 py-2 rounded-lg">
      <div className="text-lg font-medium">
        {currentPlayer ? currentPlayer.woodBalance.toString() : "0"}🪵
      </div>
    </div>
  );
}
