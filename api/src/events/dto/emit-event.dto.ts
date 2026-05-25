import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { EventType } from '../../common/enums/event-type.enum';

export class EmitEventDto {
  @IsEnum(EventType)
  type: EventType;

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  taskId?: string;
}
