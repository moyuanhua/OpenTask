import { IsString, IsOptional, IsUUID } from 'class-validator';

export class StartAgentDto {
  @IsUUID()
  taskId: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  metadata?: Record<string, unknown>;
}
