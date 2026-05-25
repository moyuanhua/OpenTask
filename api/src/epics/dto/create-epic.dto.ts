import { IsString, IsOptional, IsEnum, IsUUID, MaxLength, IsInt } from 'class-validator';
import { EpicStatus } from '../entities/epic.entity';

export class CreateEpicDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;

  @IsOptional()
  @IsInt()
  order?: number;
}
