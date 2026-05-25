import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '../common/enums/task-status.enum';
import { EventsService } from '../events/events.service';
import { EventType } from '../common/enums/event-type.enum';

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.PENDING]: [TaskStatus.PLANNING, TaskStatus.FAILED],
  [TaskStatus.PLANNING]: [TaskStatus.IN_PROGRESS, TaskStatus.PENDING, TaskStatus.FAILED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.BLOCKED, TaskStatus.WAITING_APPROVAL, TaskStatus.COMPLETED, TaskStatus.FAILED],
  [TaskStatus.BLOCKED]: [TaskStatus.IN_PROGRESS, TaskStatus.FAILED],
  [TaskStatus.WAITING_APPROVAL]: [TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.FAILED],
  [TaskStatus.COMPLETED]: [],
  [TaskStatus.FAILED]: [TaskStatus.PENDING],
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepo.create(dto);
    const saved = await this.tasksRepo.save(task);
    await this.eventsService.emit(EventType.TASK_CREATED, { taskId: saved.id, title: saved.title });
    return saved;
  }

  findAll(filters: { projectId?: string; epicId?: string; status?: TaskStatus; assigneeId?: string }): Promise<Task[]> {
    const where: Record<string, unknown> = {};
    if (filters.projectId) where['projectId'] = filters.projectId;
    if (filters.epicId) where['epicId'] = filters.epicId;
    if (filters.status) where['status'] = filters.status;
    if (filters.assigneeId) where['assigneeId'] = filters.assigneeId;
    return this.tasksRepo.find({ where: where as any, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    const saved = await this.tasksRepo.save(task);
    await this.eventsService.emit(EventType.TASK_UPDATED, { taskId: saved.id });
    return saved;
  }

  async transition(id: string, newStatus: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);
    const allowed = VALID_TRANSITIONS[task.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition task from '${task.status}' to '${newStatus}'. Allowed: [${allowed.join(', ')}]`,
      );
    }

    const prevStatus = task.status;
    task.status = newStatus;

    if (newStatus === TaskStatus.IN_PROGRESS && !task.startedAt) {
      task.startedAt = new Date();
    }
    if (newStatus === TaskStatus.COMPLETED) {
      task.completedAt = new Date();
    }

    const saved = await this.tasksRepo.save(task);
    await this.eventsService.emit(EventType.TASK_STATUS_CHANGED, {
      taskId: saved.id,
      from: prevStatus,
      to: newStatus,
    });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
    await this.eventsService.emit(EventType.TASK_DELETED, { taskId: id });
  }
}
