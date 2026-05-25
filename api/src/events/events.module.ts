import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentEvent } from '../agents/entities/agent-event.entity';
import { EventsService } from './events.service';

@Module({
  imports: [TypeOrmModule.forFeature([AgentEvent])],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
