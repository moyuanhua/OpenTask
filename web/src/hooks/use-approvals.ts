import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Approval } from '@/lib/types';

export function useApprovals() {
  return useQuery<Approval[]>({
    queryKey: ['approvals'],
    queryFn: () => api.get('/approvals'),
  });
}