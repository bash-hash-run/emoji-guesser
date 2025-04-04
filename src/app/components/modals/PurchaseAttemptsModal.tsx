import React from "react";
import { EmojiGuesserData } from "../../types";
import ConnectWallet from "../ConnectWallet";
import UsdcTransaction from "../UsdcTransaction";
import { LightningIcon } from "../icons";

interface PurchaseAttemptsModalProps {
  gameData: EmojiGuesserData;
  isOpen: boolean;
  onClose: () => void;
  onTransactionSuccess: () => void;
  onTransactionError: (errorMessage: string) => void;
  transactionError: string | null;
  transactionSuccess: boolean;
  isConnected: boolean;
}

/**
 * Modal for purchasing additional game attempts
 */
export default function PurchaseAttemptsModal({
  gameData,
  isOpen,
  onClose,
  onTransactionSuccess,
  onTransactionError,
  transactionError,
  transactionSuccess,
  isConnected,
}: PurchaseAttemptsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4">
          <h2 className="text-lg font-bold text-white">Get More Attempts</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Purchase additional attempts to continue playing! Each transaction
            gives you 10 more attempts.
          </p>

          <div className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <LightningIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  10 Attempts
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Continue your game
                </p>
              </div>
            </div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {gameData.price_for_10_attempts.toFixed(2)} USDC
            </div>
          </div>

          {transactionError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 text-sm">
              {transactionError}
            </div>
          )}

          {transactionSuccess && (
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 text-sm">
              Transaction successful! Adding attempts...
            </div>
          )}

          {!isConnected ? (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Connect your wallet to purchase:
              </p>
              <ConnectWallet />
            </div>
          ) : (
            <UsdcTransaction
              amount={gameData.price_for_10_attempts}
              recipientAddress={gameData.eth_wallet_owner}
              onSuccess={onTransactionSuccess}
              onError={onTransactionError}
              isDisabled={transactionSuccess}
            />
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
