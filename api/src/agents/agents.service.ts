import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { AgentEvent } from './entities/agent-event.entity';
import { OpenCodeProvider } from './opencode.provider';
import { TasksService } from '../tasks/tasks.service';
import { ApprovalsService } from '../approvals/approvals.service';
import { TaskStatus } from '../common/enums/task-status.enum';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectRepository(AgentEvent) private readonly agentEventsRepo: Repository<AgentEvent>,
    private readonly openCodeProvider: OpenCodeProvider,
    private readonly tasksService: TasksService,
    private readonly approvalsService: ApprovalsService,
  ) {}

  async startAgent(taskId: string, provider = 'opencode'): Promise<void> {
    const task = await this.tasksService.findOne(taskId);

    await this.tasksService.transition(taskId, TaskStatus.PLANNING);
    await this.tasksService.transition(taskId, TaskStatus.IN_PROGRESS);

    const context = {
      taskId,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      epicId: task.epicId,
    };

    await this.openCodeProvider.startTask(taskId, context);
  }

  async stopAgent(taskId: string): Promise<void> {
    await this.openCodeProvider.stopTask(taskId);
  }

  async getAgentStatus(taskId: string) {
    return this.openCodeProvider.getStatus(taskId);
  }

  async getEventsForTask(taskId: string): Promise<AgentEvent[]> {
    return this.agentEventsRepo.find({
      where: { taskId },
      order: { createdAt: 'ASC' },
    });
  }

  @OnEvent(EventType.AGENT_COMPLETED)
  async onAgentCompleted(payload: { taskId: string }) {
    try {
      this.logger.log(`Agent completed for task ${payload.taskId} — requesting approval`);
      await this.approvalsService.request({
        taskId: payload.taskId,
        requestedBy: 'agent',
        context: { reason: 'Agent completed task — awaiting human review' },
      });
    } catch (err) {
      this.logger.error(`Failed to request approval for task ${payload.taskId}`, err);
    }
  }
}
