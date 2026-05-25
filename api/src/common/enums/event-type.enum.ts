export enum EventType {
  // Task lifecycle
  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_DELETED = 'task.deleted',
  TASK_STATUS_CHANGED = 'task.status_changed',
  TASK_ASSIGNED = 'task.assigned',
  TASK_DECOMPOSED = 'task.decomposed',

  // Agent events
  AGENT_STARTED = 'agent.started',
  AGENT_STOPPED = 'agent.stopped',
  AGENT_PLANNING = 'agent.planning',
  AGENT_CODING = 'agent.coding',
  AGENT_TESTING = 'agent.testing',
  AGENT_THINKING = 'agent.thinking',
  AGENT_ERROR = 'agent.error',
  AGENT_PROGRESS = 'agent.progress',
  AGENT_COMPLETED = 'agent.completed',

  // Approval events
  APPROVAL_REQUESTED = 'approval.requested',
  APPROVAL_APPROVED = 'approval.approved',
  APPROVAL_REJECTED = 'approval.rejected',

  // Project & Epic events
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  EPIC_CREATED = 'epic.created',
  EPIC_UPDATED = 'epic.updated',
}
