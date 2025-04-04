"use client";

import React, { ReactNode } from "react";
import { WagmiProvider as WagmiConfigProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../wagmi-config";

// Create a client for TanStack Query
const queryClient = new QueryClient();

/**
 * WagmiProvider component that sets up wagmi for Ethereum wallet connections
 * @param children - Child components
 */
export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfigProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfigProvider>
  );
}
