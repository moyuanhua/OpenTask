import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { EventsService } from '../events/events.service';
import { EventType } from '../common/enums/event-type.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectsRepo: Repository<Project>,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepo.create(dto);
    const saved = await this.projectsRepo.save(project);
    await this.eventsService.emit(EventType.PROJECT_CREATED, { projectId: saved.id, name: saved.name });
    return saved;
  }

  findAll(): Promise<Project[]> {
    return this.projectsRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepo.findOne({ where: { id } });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, dto);
    const saved = await this.projectsRepo.save(project);
    await this.eventsService.emit(EventType.PROJECT_UPDATED, { projectId: saved.id });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepo.remove(project);
  }
}
