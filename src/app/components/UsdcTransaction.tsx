"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { SpinnerIcon } from "./icons";

// USDC contract ABI - only including the transfer function
const USDC_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Base chain USDC contract address
const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

interface UsdcTransactionProps {
  amount: number;
  recipientAddress: string;
  onSuccess: () => void;
  onError: (errorMessage: string) => void;
  isDisabled?: boolean;
}

/**
 * Component to handle USDC transactions on Base chain
 * @param amount - Amount in USDC to send
 * @param recipientAddress - Recipient ETH address
 * @param onSuccess - Callback function to run after successful transaction
 * @param onError - Callback function to run if transaction fails
 * @param isDisabled - Optional parameter to disable the button
 */
export default function UsdcTransaction({
  amount,
  recipientAddress,
  onSuccess,
  onError,
  isDisabled = false,
}: UsdcTransactionProps) {
  const { isConnected } = useAccount();
  const [isPending, setIsPending] = useState(false);

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setIsPending(false);
        onSuccess();
      },
      onError: () => {
        setIsPending(false);
        // Use a generic error message for all transaction errors
        onError("Transaction failed. No attempts were added.");
      },
    },
  });

  const handleTransaction = async () => {
    if (!isConnected) {
      onError("Please connect your wallet first. No attempts were added.");
      return;
    }

    try {
      setIsPending(true);

      // Convert amount to token units (USDC has 6 decimals on Base)
      const value = parseUnits(amount.toString(), 6);

      await writeContractAsync({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [recipientAddress, value],
      });
    } catch {
      setIsPending(false);
      onError("Transaction failed. No attempts were added.");
    }
  };

  return (
    <button
      onClick={handleTransaction}
      disabled={!isConnected || isPending || isDisabled}
      className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 shadow-md transition-all disabled:opacity-70"
    >
      {isPending ? (
        <div className="flex items-center justify-center">
          <SpinnerIcon className="h-5 w-5 -ml-1 mr-3 text-white" />
          Processing...
        </div>
      ) : (
        <span>Buy 10 Attempts for {amount} USDC</span>
      )}
    </button>
  );
}
