'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjects } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { useApprovals } from '@/hooks/use-approvals';
import { FolderKanban, Bot, ActivitySquare, CheckCircle2 } from 'lucide-react';

export function StatsCards() {
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const { data: approvals = [] } = useApprovals();

  const stats = [
    {
      title: "Active Projects",
      value: projects.length.toString(),
      icon: FolderKanban,
    },
    {
      title: "Active Agents",
      value: "4",
      icon: Bot,
    },
    {
      title: "Tasks In Progress",
      value: tasks.filter(t => t.status === 'in_progress').length.toString(),
      icon: ActivitySquare,
    },
    {
      title: "Waiting Approval",
      value: approvals.filter(a => a.status === 'pending').length.toString(),
      icon: CheckCircle2,
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}