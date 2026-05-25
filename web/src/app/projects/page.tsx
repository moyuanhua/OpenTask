'use client'
import { useProjects } from '@/hooks/use-projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data: projects = [] } = useProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-lg">
            No projects found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}