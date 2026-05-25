'use client'
import { useApprovals } from '@/hooks/use-approvals';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ApprovalsPage() {
  const { data: approvalsAll = [] } = useApprovals();
  const approvals = approvalsAll.filter((a: any) => a.status === 'pending');
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/approvals/${id}/approve`, { reviewedBy: 'human' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.post(`/approvals/${id}/reject`, { reviewedBy: 'human', notes: 'Rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">Review items requiring your attention before agents can proceed.</p>
      </div>
      <div className="grid gap-4">
        {approvals.map(approval => (
          <Card key={approval.id} className="overflow-hidden">
            <div className="flex items-center border-l-4 border-yellow-500">
              <CardContent className="p-6 flex-1 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-yellow-500/10 text-yellow-500 border-transparent hover:bg-yellow-500/20">Pending</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/projects/mock/tasks/${approval.taskId}`} className="font-medium hover:underline">
                    Task Requires Approval
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{approval.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500 border-emerald-500/20"
                    onClick={() => approveMutation.mutate(approval.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" /> Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-rose-500 hover:bg-rose-500/10 hover:text-rose-500 border-rose-500/20"
                    onClick={() => rejectMutation.mutate(approval.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" /> Reject
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
        {approvals.length === 0 && (
          <div className="py-12 text-center border border-dashed rounded-lg text-muted-foreground">
            No pending approvals. You're all caught up!
          </div>
        )}
      </div>
    </div>
  );
}