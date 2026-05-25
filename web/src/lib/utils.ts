import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { TaskStatus, TaskPriority } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const statusColors: Record<TaskStatus, string> = {
  pending: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_progress: "bg-green-500/10 text-green-500 border-green-500/20",
  blocked: "bg-red-500/10 text-red-500 border-red-500/20",
  waiting_approval: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  failed: "bg-rose-500/10 text-rose-500 border-rose-500/20"
};

export const priorityColors: Record<TaskPriority, string> = {
  low: "text-slate-400",
  medium: "text-blue-400",
  high: "text-orange-400",
  critical: "text-red-500"
};