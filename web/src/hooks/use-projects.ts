import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Project } from '@/lib/types';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get('/projects'),
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: () => api.get(`/projects/${id}`),
    enabled: !!id
  });
}
