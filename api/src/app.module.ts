import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { EventsModule } from './events/events.module';
import { ProjectsModule } from './projects/projects.module';
import { EpicsModule } from './epics/epics.module';
import { TasksModule } from './tasks/tasks.module';
import { AgentsModule } from './agents/agents.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
      verboseMemoryLeak: true,
    }),
    DatabaseModule,
    EventsModule,
    ProjectsModule,
    EpicsModule,
    TasksModule,
    AgentsModule,
    ApprovalsModule,
    GatewayModule,
  ],
})
export class AppModule {}
