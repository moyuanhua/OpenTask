import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { TaskPriority } from '../../common/enums/task-priority.enum';
import { AssigneeType } from '../../common/enums/assignee-type.enum';
import { Project } from '../../projects/entities/project.entity';
import { Epic } from '../../epics/entities/epic.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 255 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'varchar', length: 64, default: TaskStatus.PENDING }) status: TaskStatus;
  @Column({ type: 'varchar', length: 64, default: TaskPriority.MEDIUM }) priority: TaskPriority;
  @Column({ name: 'assignee_type', type: 'varchar', length: 64, nullable: true }) assigneeType: AssigneeType;
  @Column({ name: 'assignee_id', nullable: true }) assigneeId: string;
  @Column({ name: 'project_id', nullable: true }) projectId: string;
  @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'project_id' }) project: Project;
  @Column({ name: 'epic_id', nullable: true }) epicId: string;
  @ManyToOne(() => Epic, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'epic_id' }) epic: Epic;
  @Column({ name: 'parent_task_id', nullable: true }) parentTaskId: string;
  @ManyToOne(() => Task, { onDelete: 'SET NULL', nullable: true }) @JoinColumn({ name: 'parent_task_id' }) parentTask: Task;
  @Column({ name: 'estimated_hours', type: 'float', nullable: true }) estimatedHours: number;
  @Column({ name: 'actual_hours', type: 'float', nullable: true }) actualHours: number;
  @Column({ name: 'due_date', nullable: true }) dueDate: Date;
  @Column({ name: 'started_at', nullable: true }) startedAt: Date;
  @Column({ name: 'completed_at', nullable: true }) completedAt: Date;
  @Column({ type: 'simple-json', nullable: true }) metadata: Record<string, unknown>;
  @Column({ type: 'simple-array', nullable: true }) tags: string[];
  @Column({ name: 'agent_context', type: 'simple-json', nullable: true }) agentContext: Record<string, unknown>;
  @Column({ name: 'error_message', type: 'text', nullable: true }) errorMessage: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
