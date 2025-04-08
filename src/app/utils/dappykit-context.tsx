"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { SDK, Config } from "@dappykit/sdk";

// Define the context type
interface DappyKitContextType {
  sdk: SDK | null;
  isInitialized: boolean;
  error: Error | null;
}

// Create the context with default values
const DappyKitContext = createContext<DappyKitContextType>({
  sdk: null,
  isInitialized: false,
  error: null,
});

/**
 * Custom hook to access the DappyKit SDK instance
 * @returns The DappyKit SDK context
 */
export const useDappyKit = () => useContext(DappyKitContext);

interface DappyKitProviderProps {
  children: ReactNode;
}

/**
 * Provider component that initializes and provides the DappyKit SDK instance
 * @param props - The provider props
 * @returns DappyKit provider component
 */
export const DappyKitProvider = ({ children }: DappyKitProviderProps) => {
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeSdk = async () => {
      try {
        const dappyKit = new SDK(Config.baseMainnetConfig);
        setSdk(dappyKit);
        setIsInitialized(true);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to initialize DappyKit SDK"),
        );
      }
    };

    initializeSdk().then();
  }, []);

  return (
    <DappyKitContext.Provider value={{ sdk, isInitialized, error }}>
      {children}
    </DappyKitContext.Provider>
  );
};
