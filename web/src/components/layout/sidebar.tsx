'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: FolderKanban },
    { href: '/approvals', label: 'Approvals', icon: CheckSquare },
  ];

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col h-screen fixed left-0 top-0">
      <div className="p-4 flex items-center h-14 border-b border-border">
        <span className="font-bold text-sm tracking-widest text-primary">AOS</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}