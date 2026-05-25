import { Controller, Get, Post, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  listAgents() {
    return { agents: ['opencode'], status: 'stub' };
  }

  @Post(':taskId/start')
  @HttpCode(HttpStatus.ACCEPTED)
  async start(@Param('taskId') taskId: string, @Body('provider') provider?: string) {
    await this.agentsService.startAgent(taskId, provider);
    return { message: 'Agent started', taskId };
  }

  @Post(':taskId/stop')
  @HttpCode(HttpStatus.ACCEPTED)
  async stop(@Param('taskId') taskId: string) {
    await this.agentsService.stopAgent(taskId);
    return { message: 'Agent stopped', taskId };
  }

  @Get(':taskId/status')
  async status(@Param('taskId') taskId: string) {
    return this.agentsService.getAgentStatus(taskId);
  }

  @Get(':taskId/events')
  async events(@Param('taskId') taskId: string) {
    return this.agentsService.getEventsForTask(taskId);
  }
}
