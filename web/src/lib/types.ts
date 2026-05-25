export type TaskStatus = 'pending' | 'planning' | 'in_progress' | 'blocked' | 'waiting_approval' | 'completed' | 'failed'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type AssigneeType = 'human' | 'ai'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeType: AssigneeType
  assignedAgent?: string
  dependencies: string[]
  requiresApproval: boolean
  epicId?: string
  projectId: string
  createdAt: string
  updatedAt: string
}

export interface AgentEvent {
  id?: string
  taskId?: string
  type: string
  eventType?: string
  payload?: Record<string, unknown>
  createdAt?: string
  timestamp?: string
  message?: string
  provider?: string
  [key: string]: unknown
}

export interface Project {
  id: string
  name: string
  description: string
  status: string
  createdAt: string
}

export interface Approval {
  id: string
  taskId: string
  task: Task
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}