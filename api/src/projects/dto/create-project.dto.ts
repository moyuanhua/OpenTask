import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
