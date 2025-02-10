export { };

declare global {
  interface Window {
    avalanche?: {
      request: <T>(args: {
        method: string;
        params?: Record<string, unknown>;
        id?: number;
      }) => Promise<T>;
    }
  }
}
