declare module '@opencode-ai/sdk' {
  export function createOpencodeClient(opts: { baseUrl: string; headers?: Record<string, string> }): any;
  export function createOpencode(opts: { hostname?: string; port?: number; config?: Record<string, unknown> }): Promise<{ client: any; server: { url: string; close(): void } }>;
}
