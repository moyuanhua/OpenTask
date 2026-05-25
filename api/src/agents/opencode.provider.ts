import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  AgentProvider,
  AgentStatus,
  TaskContext,
} from '../common/interfaces/agent-provider.interface';
import { EventType } from '../common/enums/event-type.enum';
import { TaskStatus } from '../common/enums/task-status.enum';

interface SessionMeta {
  sessionId: string;
  startTime: Date;
  eventStream?: AbortController;
}

@Injectable()
export class OpenCodeProvider implements AgentProvider, OnModuleInit {
  private readonly logger = new Logger(OpenCodeProvider.name);
  private readonly tasks = new Map<string, SessionMeta>();

  // Lazy-loaded SDK client to avoid startup crash if opencode isn't running
  private client: any = null;
  private baseUrl: string;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly config: ConfigService,
  ) {
    this.baseUrl = this.config.get<string>('OPENCODE_URL', 'http://127.0.0.1:4096');
  }

  onModuleInit() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const sdk = require('@opencode-ai/sdk') as typeof import('@opencode-ai/sdk');
      this.client = sdk.createOpencodeClient({ baseUrl: this.baseUrl });
      this.logger.log(`OpenCode SDK initialised → ${this.baseUrl}`);
    } catch {
      this.logger.warn('OpenCode SDK unavailable — running in stub mode');
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Public API
  // ──────────────────────────────────────────────────────────────

  async startTask(taskId: string, context: TaskContext): Promise<void> {
    this.logger.log(`[OpenCode] Starting task ${taskId}: ${context.title}`);

    this.eventEmitter.emit(EventType.AGENT_STARTED, {
      taskId,
      provider: 'opencode',
      title: context.title,
    });

    if (!this.client) {
      // Fallback: emit a simulated event sequence for local dev
      this.simulateTask(taskId);
      return;
    }

    try {
      // 1. Create session (one session per AOS task)
      const sessionResp = await this.client.session.create({
        body: { title: `AOS:${taskId}` },
        query: context.workdir ? { directory: context.workdir } : {},
      });
      const sessionId: string = sessionResp.data.id;
      const abort = new AbortController();

      this.tasks.set(taskId, { sessionId, startTime: new Date(), eventStream: abort });

      // 2. Send prompt asynchronously (fire-and-forget; we stream results via SSE)
      await this.client.session.promptAsync({
        path: { id: sessionId },
        body: {
          agent: context.agent ?? 'sisyphus',
          ...(context.model && {
            model: {
              providerID: context.model.split('/')[0],
              modelID: context.model.split('/').slice(1).join('/'),
            },
          }),
          parts: [{ type: 'text', text: this.buildPrompt(context) }],
        },
      });

      // 3. Stream events from OpenCode back into AOS event bus
      this.streamSessionEvents(taskId, sessionId, abort.signal);
    } catch (err) {
      this.logger.error(`Failed to start task ${taskId}`, err);
      this.eventEmitter.emit(EventType.AGENT_ERROR, {
        taskId,
        provider: 'opencode',
        error: String(err),
      });
    }
  }

  async stopTask(taskId: string): Promise<void> {
    this.logger.log(`[OpenCode] Stopping task ${taskId}`);

    const meta = this.tasks.get(taskId);
    if (meta) {
      meta.eventStream?.abort();

      if (this.client) {
        try {
          await this.client.session.abort({ path: { id: meta.sessionId } });
        } catch {
          // Session may already be done
        }
      }

      this.tasks.delete(taskId);
    }

    this.eventEmitter.emit(EventType.AGENT_STOPPED, { taskId, provider: 'opencode' });
  }

  async getStatus(taskId: string): Promise<AgentStatus> {
    const meta = this.tasks.get(taskId);

    if (!meta) {
      return { taskId, running: false, currentStatus: TaskStatus.PENDING };
    }

    if (!this.client) {
      return { taskId, running: true, currentStatus: TaskStatus.IN_PROGRESS, sessionId: meta.sessionId };
    }

    try {
      const statusResp = await this.client.session.status();
      const sessionStatus = statusResp.data?.[meta.sessionId];

      const running = sessionStatus?.type !== 'idle';
      return {
        taskId,
        running,
        sessionId: meta.sessionId,
        currentStatus: running ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED,
        lastEvent: sessionStatus?.type,
      };
    } catch {
      return { taskId, running: true, currentStatus: TaskStatus.IN_PROGRESS, sessionId: meta.sessionId };
    }
  }

  // ──────────────────────────────────────────────────────────────
  // SSE bridging: OpenCode events → AOS event bus
  // ──────────────────────────────────────────────────────────────

  private async streamSessionEvents(
    taskId: string,
    sessionId: string,
    signal: AbortSignal,
  ): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/event`, {
        headers: { Accept: 'text/event-stream' },
        signal,
      });

      if (!res.ok || !res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (!signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          try {
            const event = JSON.parse(line.slice(6));
            this.bridgeEvent(taskId, sessionId, event);
          } catch {
            // Malformed SSE line — skip
          }
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        this.logger.warn(`SSE stream ended for task ${taskId}: ${err?.message}`);
      }
    }
  }

  /** Map OpenCode SSE event types to AOS EventType enum values */
  private bridgeEvent(taskId: string, sessionId: string, raw: any): void {
    const props = raw?.properties ?? {};

    // Filter to this session only
    const sid = props?.sessionID ?? props?.part?.sessionID ?? props?.info?.sessionID;
    if (sid && sid !== sessionId) return;

    const mapped = OPENCODE_EVENT_MAP[raw?.type as string];
    if (!mapped) return;

    this.eventEmitter.emit(mapped, {
      taskId,
      provider: 'opencode',
      sessionId,
      raw,
      message: props?.delta ?? props?.part?.text ?? props?.error,
    });

    // Auto-complete task on session.idle
    if (raw?.type === 'session.idle') {
      this.tasks.delete(taskId);
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Stub mode: local dev without real OpenCode
  // ──────────────────────────────────────────────────────────────

  private simulateTask(taskId: string): void {
    const sequence: Array<{ type: EventType; delay: number; message: string }> = [
      { type: EventType.AGENT_THINKING, delay: 600,  message: 'Analysing task requirements...' },
      { type: EventType.AGENT_PLANNING, delay: 1800, message: 'Drafting implementation plan...' },
      { type: EventType.AGENT_CODING,   delay: 3500, message: 'Writing implementation...' },
      { type: EventType.AGENT_TESTING,  delay: 5500, message: 'Running tests...' },
      { type: EventType.AGENT_COMPLETED,delay: 7200, message: 'Task completed successfully' },
    ];

    // Store a dummy entry so getStatus() sees it as running
    this.tasks.set(taskId, { sessionId: `stub:${taskId}`, startTime: new Date() });

    sequence.forEach(({ type, delay, message }) => {
      setTimeout(() => {
        if (this.tasks.has(taskId)) {
          this.eventEmitter.emit(type, { taskId, provider: 'opencode-stub', message });
        }
      }, delay);
    });

    setTimeout(() => this.tasks.delete(taskId), 8000);
  }

  private buildPrompt(ctx: TaskContext): string {
    return [
      ctx.description ?? ctx.title,
      ctx.workdir ? `\n\nWorking directory: ${ctx.workdir}` : '',
    ]
      .join('')
      .trim();
  }
}

// OpenCode SSE event type → AOS EventType mapping
const OPENCODE_EVENT_MAP: Record<string, EventType> = {
  'session.idle':            EventType.AGENT_COMPLETED,
  'session.error':           EventType.AGENT_ERROR,
  'message.part.updated':    EventType.AGENT_CODING,
  'message.updated':         EventType.AGENT_PROGRESS,
  'session.status':          EventType.AGENT_PROGRESS,
};
