import { IsEnum } from 'class-validator';
import { TaskStatus } from '../../common/enums/task-status.enum';

export class TransitionTaskDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
