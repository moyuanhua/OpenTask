'use client'
import { useTaskEvents } from '@/hooks/use-task-events';
import { useRef } from 'react';

export function AgentLogs({ taskId }: { taskId: string }) {
  const events = useTaskEvents(taskId);
  const bottomRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) {
    return (
      <div className="h-full w-full bg-card p-4 font-mono text-xs text-muted-foreground flex items-center justify-center">
        Waiting for agent output...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-card overflow-y-auto p-4 font-mono text-xs space-y-2">
      {events.map((event, i) => {
        const ts = event.createdAt || event.timestamp
        const timeStr = ts
          ? new Date(ts).toLocaleTimeString([], { hour12: false })
          : new Date().toLocaleTimeString([], { hour12: false })
        const label = event.type || event.eventType || 'event'
        const msg = event.message || (event.payload ? JSON.stringify(event.payload) : '')
        const key = event.id ?? `${event.type}-${i}`
        return (
          <div key={key} className="flex gap-4 hover:bg-accent/50 py-1 rounded px-2">
            <span className="text-muted-foreground shrink-0 w-24">{timeStr}</span>
            <span className="text-blue-400 shrink-0 w-40">[{label}]</span>
            <span className="text-foreground flex-1 break-words">{msg}</span>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  );
}