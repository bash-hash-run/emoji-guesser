"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import sdk from "@farcaster/frame-sdk";
import { FarcasterContext } from "../types";
import { logSDKEvent, getSDKDebugInfo } from "../utils/sdk-debug";

// Define the SDK interface with the methods we need
interface SDK {
  context: FarcasterContext;
  on(event: string, listener: () => void): void;
  removeListener(event: string, listener: () => void): void;
  removeAllListeners(): void;
  actions: {
    ready(): Promise<void>;
    openUrl(url: string): Promise<void>;
    shareTo?: (
      destination: string,
      content: { text: string; embeds?: string[] },
    ) => Promise<void>;
  };
}

// Create context with default values
const FarcasterSDKContext = createContext<{
  sdk: SDK | null;
  context: FarcasterContext | null;
  loading: boolean;
  error: string | null;
}>({
  sdk: null,
  context: null,
  loading: true,
  error: null,
});

/**
 * Custom hook to use the Farcaster SDK
 * @returns Farcaster SDK context
 */
export function useFarcaster() {
  return useContext(FarcasterSDKContext);
}

interface FarcasterProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the application and initializes the Farcaster SDK
 * @param children - Child components
 */
export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [sdkInstance, setSdkInstance] = useState<SDK | null>(null);
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run initialization once
    if (sdkInstance) return;

    const initializeSdk = async () => {
      try {
        logSDKEvent("Initializing SDK", getSDKDebugInfo());

        // Initialize the SDK
        // Use unknown as an intermediary cast to avoid TypeScript errors
        const frameSDK = sdk as unknown as SDK;
        setSdkInstance(frameSDK);

        // Get context information about the user and client
        const contextData = frameSDK.context;
        logSDKEvent("SDK Context Loaded", contextData);
        setContext(contextData);

        // Set up event listeners
        frameSDK.on("frameAdded", () => {
          logSDKEvent("Event: frameAdded");
          // Update the context to reflect the change
          setContext((prev) =>
            prev ? { ...prev, client: { ...prev.client, added: true } } : null,
          );
        });

        frameSDK.on("frameRemoved", () => {
          logSDKEvent("Event: frameRemoved");
          // Update the context to reflect the change
          setContext((prev) =>
            prev ? { ...prev, client: { ...prev.client, added: false } } : null,
          );
        });

        frameSDK.on("notificationsEnabled", () => {
          logSDKEvent("Event: notificationsEnabled");
          // You would typically refresh the context here
        });

        frameSDK.on("notificationsDisabled", () => {
          logSDKEvent("Event: notificationsDisabled");
          // You would typically refresh the context here
        });

        setLoading(false);
      } catch (error) {
        console.error("Error initializing Farcaster SDK:", error);
        logSDKEvent("SDK Initialization Error", error);
        setError("Failed to initialize Farcaster SDK");
        setLoading(false);
      }
    };

    initializeSdk().then();
  }, [sdkInstance]);

  // Call sdk.actions.ready() when the application is ready to be displayed
  useEffect(() => {
    // Only proceed if SDK is loaded and we haven't called ready yet
    if (!sdkInstance || isReady || loading) return;

    const notifyReady = async () => {
      try {
        logSDKEvent("Calling sdk.actions.ready()");
        await sdkInstance.actions.ready();
        logSDKEvent("Successfully called sdk.actions.ready()");
        setIsReady(true);
      } catch (error) {
        console.error("Error calling sdk.actions.ready():", error);
        logSDKEvent("Error calling sdk.actions.ready()", error);
      }
    };

    // Wait a short moment to ensure DOM is fully rendered
    // This helps avoid content reflows as suggested in the docs
    const readyTimer = setTimeout(notifyReady, 100);

    return () => clearTimeout(readyTimer);
  }, [sdkInstance, isReady, loading]);

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      if (sdkInstance) {
        logSDKEvent("Cleaning up event listeners");
        sdkInstance.removeAllListeners();
      }
    };
  }, [sdkInstance]);

  // Apply safe area insets to body if available
  useEffect(() => {
    if (context?.client?.safeAreaInsets) {
      const { top, bottom, left, right } = context.client.safeAreaInsets;
      logSDKEvent("Applying safe area insets", context.client.safeAreaInsets);
      document.body.style.paddingTop = `${top}px`;
      document.body.style.paddingBottom = `${bottom}px`;
      document.body.style.paddingLeft = `${left}px`;
      document.body.style.paddingRight = `${right}px`;
    }

    return () => {
      // Reset styles on unmount
      document.body.style.paddingTop = "";
      document.body.style.paddingBottom = "";
      document.body.style.paddingLeft = "";
      document.body.style.paddingRight = "";
    };
  }, [context?.client?.safeAreaInsets]);

  return (
    <FarcasterSDKContext.Provider
      value={{ sdk: sdkInstance, context, loading, error }}
    >
      {children}
    </FarcasterSDKContext.Provider>
  );
}
