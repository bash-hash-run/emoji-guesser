import { useWriteContract, useAccount } from "wagmi";
import { createWalletClient, custom } from "viem";
import { base } from "viem/chains";

/**
 * Multihash structure for file hashes
 */
export interface Multihash {
  hash: `0x${string}`;
  hashFunction: number;
  size: number;
}

/**
 * DappyKit FilesystemChanges ABI for the setUserChange function
 */
export const filesystemChangesAbi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "hash",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "hashFunction",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "size",
            type: "uint8",
          },
        ],
        internalType: "struct FilesystemChanges.Multihash",
        name: "multihash",
        type: "tuple",
      },
    ],
    name: "setUserChange",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

/**
 * Sets user changes multihash on the blockchain directly without using hooks
 * Note: This uses the browser's ethereum provider and is meant for non-React contexts
 * @param filesystemChangesAddress - The address of the FilesystemChanges contract
 * @param multihash - Multihash object containing hash, hashFunction, and size
 * @returns Promise of transaction hash
 */
export const setUserChangeNonHook = async (
  filesystemChangesAddress: `0x${string}`,
  multihash: Multihash,
) => {
  if (!filesystemChangesAddress) {
    throw new Error("FilesystemChanges address is not defined");
  }

  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Browser ethereum provider not available");
  }

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
  });

  const [address] = await walletClient.getAddresses();

  return walletClient.writeContract({
    address: filesystemChangesAddress,
    abi: filesystemChangesAbi,
    functionName: "setUserChange",
    args: [multihash],
    account: address,
  });
};

/**
 * Hook for using DappyKit filesystem changes with non-hook write function
 * @param filesystemChangesAddress - The address of the FilesystemChanges contract
 * @returns Object with setUserChange function
 */
export const useDappyKitHelper = (filesystemChangesAddress: `0x${string}`) => {
  const { writeContract, writeContractAsync } = useWriteContract();
  const { address } = useAccount();

  /**
   * Sets user changes multihash on the blockchain without waiting for transaction
   * @param multihash - Multihash object containing hash, hashFunction, and size
   * @returns Transaction hash
   */
  const setUserChange = (multihash: Multihash) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (!filesystemChangesAddress) {
      throw new Error("FilesystemChanges address is not defined");
    }

    return writeContract({
      address: filesystemChangesAddress,
      abi: filesystemChangesAbi,
      functionName: "setUserChange",
      args: [multihash],
    });
  };

  /**
   * Sets user changes multihash on the blockchain and waits for transaction
   * @param multihash - Multihash object containing hash, hashFunction, and size
   * @returns Promise of transaction hash
   */
  const setUserChangeAsync = async (multihash: Multihash) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    if (!filesystemChangesAddress) {
      throw new Error("FilesystemChanges address is not defined");
    }

    return writeContractAsync({
      address: filesystemChangesAddress,
      abi: filesystemChangesAbi,
      functionName: "setUserChange",
      args: [multihash],
    });
  };

  return {
    setUserChange,
    setUserChangeAsync,
  };
};
