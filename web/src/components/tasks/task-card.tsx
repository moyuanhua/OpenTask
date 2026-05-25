'use client'
import { Task } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { statusColors, priorityColors } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import Link from 'next/link';

export function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/projects/${task.projectId}/tasks/${task.id}`}>
      <Card className="p-3 hover:border-primary/50 transition-colors cursor-pointer bg-card">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium leading-tight">{task.title}</p>
          </div>
          <div className="flex items-center justify-between text-xs">
            <Badge variant="outline" className={`${statusColors[task.status]} border bg-transparent font-normal`}>
              {task.status.replace('_', ' ')}
            </Badge>
            <div className="flex items-center gap-2">
              <span className={`${priorityColors[task.priority]} capitalize`}>
                {task.priority}
              </span>
              <div className="w-5 h-5 rounded flex items-center justify-center bg-accent text-muted-foreground border border-border">
                {task.assigneeType === 'ai' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}