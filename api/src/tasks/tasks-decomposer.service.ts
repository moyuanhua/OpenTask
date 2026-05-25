import { Injectable } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EventsService } from '../events/events.service';
import { EventType } from '../common/enums/event-type.enum';
import { TaskStatus } from '../common/enums/task-status.enum';
import { TaskPriority } from '../common/enums/task-priority.enum';
import { AssigneeType } from '../common/enums/assignee-type.enum';

@Injectable()
export class TasksDecomposerService {
  constructor(
    private readonly tasksService: TasksService,
    private readonly eventsService: EventsService,
  ) {}

  async decompose(parentTaskId: string): Promise<void> {
    const parent = await this.tasksService.findOne(parentTaskId);

    const subtaskDefs = [
      { title: `[Plan] ${parent.title}`, priority: TaskPriority.HIGH },
      { title: `[Implement] ${parent.title}`, priority: TaskPriority.HIGH },
      { title: `[Test] ${parent.title}`, priority: TaskPriority.MEDIUM },
      { title: `[Review] ${parent.title}`, priority: TaskPriority.MEDIUM },
    ];

    const subtasks = await Promise.all(
      subtaskDefs.map((def) =>
        this.tasksService.create({
          title: def.title,
          projectId: parent.projectId,
          epicId: parent.epicId,
          parentTaskId: parent.id,
          priority: def.priority,
          status: TaskStatus.PENDING,
          assigneeType: AssigneeType.AI,
          tags: ['auto-decomposed'],
        }),
      ),
    );

    await this.eventsService.emit(EventType.TASK_DECOMPOSED, {
      parentTaskId: parent.id,
      subtaskIds: subtasks.map((t) => t.id),
    });
  }
}
