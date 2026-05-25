'use client'
import { useTaskEvents } from '@/hooks/use-task-events';
import { useEffect, useRef } from 'react';

export function AgentLogs({ taskId }: { taskId: string }) {
  const events = useTaskEvents(taskId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="h-full w-full bg-card p-4 font-mono text-xs text-muted-foreground flex items-center justify-center">
        Waiting for agent output...
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-card overflow-y-auto p-4 font-mono text-xs space-y-2">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4 hover:bg-accent/50 py-1 rounded px-2">
          <span className="text-muted-foreground shrink-0 w-24">
            {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
          </span>
          <span className="text-blue-400 shrink-0 w-32">[{event.eventType}]</span>
          <span className="text-foreground flex-1 break-words">
            {JSON.stringify(event.payload)}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}