import { TaskStatus } from '../enums/task-status.enum';

export interface TaskContext {
  taskId: string;
  title: string;
  description?: string;
  projectId?: string;
  epicId?: string;
  workdir?: string;
  agent?: string;
  model?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentStatus {
  taskId: string;
  running: boolean;
  progress?: number;
  lastEvent?: string;
  error?: string;
  sessionId?: string;
  currentStatus: TaskStatus;
}

export interface AgentProvider {
  startTask(taskId: string, context: TaskContext): Promise<void>;
  stopTask(taskId: string): Promise<void>;
  getStatus(taskId: string): Promise<AgentStatus>;
}
