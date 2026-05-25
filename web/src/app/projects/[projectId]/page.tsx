'use client'
import { useState } from 'react';
import { useProject } from '@/hooks/use-projects';
import { TaskBoard } from '@/components/tasks/task-board';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ProjectDetail({ params }: { params: { projectId: string } }) {
  const { data: project } = useProject(params.projectId);
  const queryClient = useQueryClient();
  const [showNewTask, setShowNewTask] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const mutation = useMutation({
    mutationFn: (newTask: any) => api.post('/tasks', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params.projectId] });
      setShowNewTask(false);
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, description, priority, projectId: params.projectId });
  };

  if (!project) return null;

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setShowNewTask(true)}>
          <Plus className="w-4 h-4" /> New Task
        </Button>
      </div>
      <TaskBoard projectId={project.id} />

      {showNewTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Dialog>
            <DialogContent>
              <div className="bg-card p-6 rounded-lg border border-border w-[500px]">
                <DialogHeader>
                  <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="task-title" className="text-sm font-medium">Title</label>
                    <Input 
                      id="task-title"
                      required 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="task-desc" className="text-sm font-medium">Description</label>
                    <textarea 
                      id="task-desc"
                      className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Task description"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="task-priority" className="text-sm font-medium">Priority</label>
                    <select
                      id="task-priority"
                      className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="pending" className="bg-card">Pending</option>
                      <option value="low" className="bg-card">Low</option>
                      <option value="medium" className="bg-card">Medium</option>
                      <option value="high" className="bg-card">High</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setShowNewTask(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Creating...' : 'Create Task'}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}