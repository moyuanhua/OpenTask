import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval, ApprovalStatus } from './entities/approval.entity';
import { RequestApprovalDto, ReviewApprovalDto } from './dto/approval.dto';
import { TasksService } from '../tasks/tasks.service';
import { EventsService } from '../events/events.service';
import { EventType } from '../common/enums/event-type.enum';
import { TaskStatus } from '../common/enums/task-status.enum';

@Injectable()
export class ApprovalsService {
  constructor(
    @InjectRepository(Approval) private readonly approvalsRepo: Repository<Approval>,
    private readonly tasksService: TasksService,
    private readonly eventsService: EventsService,
  ) {}

  async request(dto: RequestApprovalDto): Promise<Approval> {
    await this.tasksService.transition(dto.taskId, TaskStatus.WAITING_APPROVAL);

    const approval = this.approvalsRepo.create({
      taskId: dto.taskId,
      requestedBy: dto.requestedBy,
      context: dto.context,
      status: ApprovalStatus.PENDING,
    });
    const saved = await this.approvalsRepo.save(approval);

    await this.eventsService.emit(EventType.APPROVAL_REQUESTED, {
      approvalId: saved.id,
      taskId: saved.taskId,
      requestedBy: saved.requestedBy,
    });

    return saved;
  }

  async approve(id: string, dto: ReviewApprovalDto): Promise<Approval> {
    const approval = await this.findOne(id);
    approval.status = ApprovalStatus.APPROVED;
    approval.reviewedBy = dto.reviewedBy ?? null!;
    approval.notes = dto.notes ?? null!;
    approval.reviewedAt = new Date();
    const saved = await this.approvalsRepo.save(approval);

    await this.tasksService.transition(approval.taskId, TaskStatus.COMPLETED);
    await this.eventsService.emit(EventType.APPROVAL_APPROVED, {
      approvalId: saved.id,
      taskId: saved.taskId,
      reviewedBy: saved.reviewedBy,
    });

    return saved;
  }

  async reject(id: string, dto: ReviewApprovalDto): Promise<Approval> {
    const approval = await this.findOne(id);
    approval.status = ApprovalStatus.REJECTED;
    approval.reviewedBy = dto.reviewedBy ?? null!;
    approval.notes = dto.notes ?? null!;
    approval.reviewedAt = new Date();
    const saved = await this.approvalsRepo.save(approval);

    await this.tasksService.transition(approval.taskId, TaskStatus.IN_PROGRESS);
    await this.eventsService.emit(EventType.APPROVAL_REJECTED, {
      approvalId: saved.id,
      taskId: saved.taskId,
      reviewedBy: saved.reviewedBy,
    });

    return saved;
  }

  findAll(taskId?: string): Promise<Approval[]> {
    const where = taskId ? { taskId } : {};
    return this.approvalsRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Approval> {
    const approval = await this.approvalsRepo.findOne({ where: { id } });
    if (!approval) throw new NotFoundException(`Approval ${id} not found`);
    return approval;
  }
}
