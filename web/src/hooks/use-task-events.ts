import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { AgentEvent } from '@/lib/types';

export function useTaskEvents(taskId: string) {
  const [events, setEvents] = useState<AgentEvent[]>([]);

  useEffect(() => {
    if (!taskId) return;
    socket.connect();
    socket.emit('subscribe:task', { taskId });

    const handleEvent = (event: AgentEvent) => {
      setEvents(prev => [...prev, event]);
    };

    socket.on('event', handleEvent);

    return () => {
      socket.emit('unsubscribe:task', { taskId });
      socket.off('event', handleEvent);
      socket.disconnect();
    };
  }, [taskId]);

  return events;
}