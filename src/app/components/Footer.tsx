"use client";

import { useAccount } from "wagmi";
import { truncateEthAddress } from "../utils";
import { useEffect, useState } from "react";
import { StarIcon } from "./icons";

/**
 * Footer component showing connected account or default app text
 */
export default function Footer() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Only show wallet connection status after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 w-full p-2 pb-6 flex justify-center items-center text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm z-10">
      {mounted && isConnected && address ? (
        <p className="text-center flex items-center">
          <StarIcon className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
          Connected account: {truncateEthAddress(address)}
        </p>
      ) : (
        <p className="text-center">
          <span className="pulse inline-block h-2 w-2 rounded-full bg-emerald-400 mr-2"></span>
          Emoji Guesser - Test your emoji skills!
        </p>
      )}
    </footer>
  );
}
