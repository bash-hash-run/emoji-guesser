type JsonRpcParams = Array<unknown>;

interface JsonRpcRequest {
  method: string;
  params?: JsonRpcParams;
}

interface JsonRpcResponse {
  id: number | string | null;
  jsonrpc: "2.0";
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: JsonRpcRequest) => Promise<unknown>;
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    removeListener: (
      event: string,
      callback: (...args: unknown[]) => void,
    ) => void;
    selectedAddress?: string;
    chainId?: string;
    sendAsync?: (
      request: JsonRpcRequest,
      callback: (error: Error | null, response: JsonRpcResponse) => void,
    ) => void;
    send?: (
      request: JsonRpcRequest,
      callback: (error: Error | null, response: JsonRpcResponse) => void,
    ) => void;
    enable?: () => Promise<string[]>;
  };
}
