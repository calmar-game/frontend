interface Window {
  Buffer: typeof Buffer;
  process: {
    env: Record<string, string>;
  };
}