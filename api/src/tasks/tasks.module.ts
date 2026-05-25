import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksDecomposerService } from './tasks-decomposer.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), EventsModule],
  controllers: [TasksController],
  providers: [TasksService, TasksDecomposerService],
  exports: [TasksService],
})
export class TasksModule {}
