export { };

declare global {
  interface Window {
    avalanche?: {
      request: (args: {
        method: string;
        params?: Record<string, unknown>;
        id?: number;
      }) => Promise<unknown>;
    }
  }
}
