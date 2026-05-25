'use client'
import { useTasks } from '@/hooks/use-tasks';
import { TaskStatus } from '@/lib/types';
import { TaskCard } from './task-card';

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'pending', label: 'Todo' },
  { id: 'planning', label: 'Planning' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'waiting_approval', label: 'Review' },
  { id: 'completed', label: 'Done' }
];

export function TaskBoard({ projectId }: { projectId: string }) {
  const { data: tasks = [] } = useTasks(projectId);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 flex-1 h-full min-h-0">
      {COLUMNS.map(col => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <div key={col.id} className="flex-shrink-0 w-80 flex flex-col bg-accent/30 rounded-lg border border-border">
            <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
              <h3 className="text-sm font-medium">{col.label}</h3>
              <span className="text-xs bg-accent px-2 py-0.5 rounded text-muted-foreground">
                {colTasks.length}
              </span>
            </div>
            <div className="p-2 space-y-2 overflow-y-auto flex-1 min-h-0">
              {colTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}