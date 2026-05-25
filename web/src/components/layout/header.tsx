'use client'
import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10 w-full">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>4 Agents Active</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium border border-border">
          JD
        </div>
      </div>
    </header>
  );
}