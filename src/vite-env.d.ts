/// <reference types="vite/client" />

declare global {
  interface Window {
    help: () => string;
    viewMission: () => string;
    accessCode: (code: string) => string;
  }
}