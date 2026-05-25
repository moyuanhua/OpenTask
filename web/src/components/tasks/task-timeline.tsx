'use client'
import { useTaskEvents } from '@/hooks/use-task-events';
import { Circle } from 'lucide-react';

export function TaskTimeline({ taskId }: { taskId: string }) {
  const events = useTaskEvents(taskId);

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No events recorded yet.</p>;
  }

  return (
    <div className="space-y-4 pb-4">
      {events.map((event, i) => (
        <div key={i} className="flex gap-3 relative">
          <div className="flex flex-col items-center">
            <Circle className="w-3 h-3 text-primary mt-1" />
            {i !== events.length - 1 && <div className="w-px h-full bg-border mt-1" />}
          </div>
          <div className="space-y-1 pb-4">
            <p className="text-sm font-medium leading-none">{event.eventType}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}