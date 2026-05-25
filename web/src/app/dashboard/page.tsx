'use client'
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/projects">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </Link>
      </div>
      <StatsCards />
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityFeed />
      </div>
    </div>
  );
}