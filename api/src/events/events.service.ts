import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentEvent } from '../agents/entities/agent-event.entity';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(AgentEvent) private readonly agentEventsRepo: Repository<AgentEvent>,
  ) {}

  async emit(type: EventType, payload: Record<string, unknown> = {}): Promise<void> {
    this.logger.debug(`Emitting event: ${type}`);

    this.eventEmitter.emit(type, { type, ...payload, timestamp: new Date().toISOString() });

    try {
      const event = this.agentEventsRepo.create({
        type,
        payload,
        taskId: payload['taskId'] as string | undefined,
        projectId: payload['projectId'] as string | undefined,
      });
      await this.agentEventsRepo.save(event);
    } catch (err) {
      this.logger.error(`Failed to persist event ${type}`, err);
    }
  }

  async getEvents(filters: { taskId?: string; type?: EventType; limit?: number }): Promise<AgentEvent[]> {
    const query = this.agentEventsRepo.createQueryBuilder('e').orderBy('e.createdAt', 'DESC');

    if (filters.taskId) query.andWhere('e.taskId = :taskId', { taskId: filters.taskId });
    if (filters.type) query.andWhere('e.type = :type', { type: filters.type });
    if (filters.limit) query.limit(filters.limit);

    return query.getMany();
  }
}
