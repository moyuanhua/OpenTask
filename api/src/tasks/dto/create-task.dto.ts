import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  IsNumber,
  IsDateString,
  IsArray,
  IsObject,
} from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { AssigneeType } from '../../common/enums/assignee-type.enum';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsEnum(AssigneeType)
  assigneeType?: AssigneeType;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  epicId?: string;

  @IsOptional()
  @IsUUID()
  parentTaskId?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
