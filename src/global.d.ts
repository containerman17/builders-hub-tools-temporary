export {};

declare global {
    interface Window {
      avalanche?: {
          request: (args: {
              method: string;
              params?: any[];
              id?: number;
          }) => Promise<any>;
      }
    }
  }
  