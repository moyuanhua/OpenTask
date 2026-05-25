import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksDecomposerService } from './tasks-decomposer.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TransitionTaskDto } from './dto/transition-task.dto';
import { TaskStatus } from '../common/enums/task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly decomposerService: TasksDecomposerService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('epicId') epicId?: string,
    @Query('status') status?: TaskStatus,
    @Query('assigneeId') assigneeId?: string,
  ) {
    return this.tasksService.findAll({ projectId, epicId, status, assigneeId });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Patch(':id/status')
  transition(@Param('id', ParseUUIDPipe) id: string, @Body() dto: TransitionTaskDto) {
    return this.tasksService.transition(id, dto.status);
  }

  @Post(':id/decompose')
  @HttpCode(HttpStatus.ACCEPTED)
  decompose(@Param('id', ParseUUIDPipe) id: string) {
    return this.decomposerService.decompose(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }
}
