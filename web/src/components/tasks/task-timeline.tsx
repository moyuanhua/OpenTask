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
      {events.map((event, i) => {
        const ts = event.createdAt || event.timestamp
        const key = event.id ?? `${event.type}-${i}`
        return (
          <div key={key} className="flex gap-3 relative">
            <div className="flex flex-col items-center">
              <Circle className="w-3 h-3 text-primary mt-1" />
              {i !== events.length - 1 && <div className="w-px h-full bg-border mt-1" />}
            </div>
            <div className="space-y-1 pb-4">
              <p className="text-sm font-medium leading-none">{event.type || event.eventType}</p>
              <p className="text-xs text-muted-foreground">
                {ts ? new Date(ts).toLocaleString() : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  );
}
