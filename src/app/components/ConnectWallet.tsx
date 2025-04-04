"use client";

import { useAccount, useConnect } from "wagmi";
import { truncateEthAddress } from "../utils";
import { StarIcon } from "./icons";

/**
 * Simple wallet connection component that only displays the ETH address
 */
export default function ConnectWallet() {
  const { isConnected, address } = useAccount();
  const { connect, connectors, isPending } = useConnect();

  if (isConnected && address) {
    return (
      <div className="flex flex-col items-center">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 w-full">
          <div className="flex items-center justify-center">
            <StarIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
            <span className="text-sm font-medium">
              {truncateEthAddress(address)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending || connectors.length === 0}
      className="w-full p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 flex items-center justify-center transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-800/40"
    >
      <StarIcon className="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
      <span className="text-sm font-medium">
        {isPending ? "Connecting..." : "Connect Wallet"}
      </span>
    </button>
  );
}
