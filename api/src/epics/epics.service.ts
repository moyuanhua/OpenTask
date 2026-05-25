import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epic } from './entities/epic.entity';
import { CreateEpicDto } from './dto/create-epic.dto';
import { UpdateEpicDto } from './dto/update-epic.dto';
import { EventsService } from '../events/events.service';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class EpicsService {
  constructor(
    @InjectRepository(Epic) private readonly epicsRepo: Repository<Epic>,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateEpicDto): Promise<Epic> {
    const epic = this.epicsRepo.create(dto);
    const saved = await this.epicsRepo.save(epic);
    await this.eventsService.emit(EventType.EPIC_CREATED, { epicId: saved.id, projectId: saved.projectId });
    return saved;
  }

  findAll(projectId?: string): Promise<Epic[]> {
    const where = projectId ? { projectId } : {};
    return this.epicsRepo.find({ where, order: { order: 'ASC', createdAt: 'ASC' } });
  }

  async findOne(id: string): Promise<Epic> {
    const epic = await this.epicsRepo.findOne({ where: { id } });
    if (!epic) throw new NotFoundException(`Epic ${id} not found`);
    return epic;
  }

  async update(id: string, dto: UpdateEpicDto): Promise<Epic> {
    const epic = await this.findOne(id);
    Object.assign(epic, dto);
    const saved = await this.epicsRepo.save(epic);
    await this.eventsService.emit(EventType.EPIC_UPDATED, { epicId: saved.id });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const epic = await this.findOne(id);
    await this.epicsRepo.remove(epic);
  }
}
