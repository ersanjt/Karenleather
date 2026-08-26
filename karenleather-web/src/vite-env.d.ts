/// <reference types="vite/client" />

declare module "@content/*.json" {
  const value: unknown;
  export default value;
}
