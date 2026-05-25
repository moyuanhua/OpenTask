import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEvent } from './entities/agent-event.entity';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { OpenCodeProvider } from './opencode.provider';
import { TasksModule } from '../tasks/tasks.module';
import { EventsModule } from '../events/events.module';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEvent]), TasksModule, EventsModule, ApprovalsModule],
  controllers: [AgentsController],
  providers: [AgentsService, OpenCodeProvider],
  exports: [AgentsService],
})
export class AgentsModule {}
