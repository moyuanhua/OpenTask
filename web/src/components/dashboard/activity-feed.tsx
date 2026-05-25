'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, GitCommit, MessageSquare } from 'lucide-react';

export function ActivityFeed() {
  const feed = [
    { id: '1', title: 'Code Review Completed', agent: 'Librarian', time: '10 mins ago', icon: GitCommit },
    { id: '2', title: 'Task Planning Started', agent: 'Oracle', time: '1 hr ago', icon: MessageSquare },
    { id: '3', title: 'Build Failed - Needs Approval', agent: 'Hephaestus', time: '2 hrs ago', icon: Bot },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Agent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feed.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-4">
                <div className="p-2 bg-accent rounded-md border border-border">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.agent}</p>
                </div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}