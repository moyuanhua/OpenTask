'use client'
import { useTask } from '@/hooks/use-tasks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { statusColors, priorityColors } from '@/lib/utils';
import { AgentLogs } from '@/components/tasks/agent-logs';
import { TaskTimeline } from '@/components/tasks/task-timeline';
import { Bot, User, Play } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function TaskDetail({ params }: { params: { taskId: string, projectId: string } }) {
  const { data: task } = useTask(params.taskId);
  const queryClient = useQueryClient();

  const startAgentMutation = useMutation({
    mutationFn: () => api.post(`/agents/${params.taskId}/start`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params.taskId] });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const approvals = await api.get(`/approvals?taskId=${params.taskId}`);
      const pending = approvals.find((a: any) => a.status === 'pending');
      if (pending) {
        return api.post(`/approvals/${pending.id}/approve`, { reviewedBy: 'human' });
      }
      throw new Error('No pending approval found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params.taskId] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const approvals = await api.get(`/approvals?taskId=${params.taskId}`);
      const pending = approvals.find((a: any) => a.status === 'pending');
      if (pending) {
        return api.post(`/approvals/${pending.id}/reject`, { reviewedBy: 'human', notes: 'Rejected' });
      }
      throw new Error('No pending approval found');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params.taskId] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });

  if (!task) return null;

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      <div className="col-span-2 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pr-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">TASK-{task.id.slice(0,4)}</span>
              <Badge variant="outline" className={`${statusColors[task.status]} bg-transparent font-normal`}>
                {task.status.replace('_', ' ')}
              </Badge>
              <span className={`${priorityColors[task.priority]} capitalize`}>
                {task.priority} Priority
              </span>
            </div>
            {(task.status === 'pending' || task.status === 'blocked') && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => startAgentMutation.mutate()}
                disabled={startAgentMutation.isPending}
              >
                <Play className="w-4 h-4 mr-2" />
                {startAgentMutation.isPending ? 'Starting...' : 'Start Agent'}
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        <div className="flex items-center gap-4 py-4 border-y border-border">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded bg-accent flex items-center justify-center border border-border">
              {task.assigneeType === 'ai' ? <Bot className="w-4 h-4 text-primary" /> : <User className="w-4 h-4 text-primary" />}
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground">Assignee</p>
              <p className="capitalize">{task.assignedAgent || 'Unassigned'}</p>
            </div>
          </div>
        </div>

        {task.status === 'waiting_approval' && (
          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
            <h3 className="font-medium text-yellow-500 mb-2">Approval Required</h3>
            <p className="text-sm text-yellow-500/80 mb-4">The agent is blocked and waiting for human approval to proceed.</p>
            <div className="flex gap-2">
              <button 
                type="button"
                className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                {approveMutation.isPending ? 'Approving...' : 'Approve'}
              </button>
              <button 
                type="button"
                className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-500/20 transition-colors disabled:opacity-50"
                onClick={() => rejectMutation.mutate()}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 min-h-0 border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="bg-accent/50 p-2 border-b border-border text-xs font-medium text-muted-foreground font-mono">
            &gt; AGENT LOGS
          </div>
          <div className="flex-1 overflow-hidden">
            <AgentLogs taskId={task.id} />
          </div>
        </div>
      </div>

      <div className="col-span-1 border-l border-border pl-6 flex flex-col h-full min-h-0">
        <h3 className="font-medium mb-4 shrink-0">Timeline</h3>
        <div className="flex-1 overflow-y-auto">
          <TaskTimeline taskId={task.id} />
        </div>
      </div>
    </div>
  );
}