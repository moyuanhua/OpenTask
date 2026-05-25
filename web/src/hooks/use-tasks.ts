import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';

export function useTasks(projectId?: string) {
  return useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => api.get(projectId ? `/tasks?projectId=${projectId}` : '/tasks'),
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: () => api.get(`/tasks/${id}`),
    enabled: !!id
  });
}