import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

export enum ApprovalStatus { PENDING='pending', APPROVED='approved', REJECTED='rejected' }

@Entity('approvals')
export class Approval {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'task_id' }) taskId: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'task_id' }) task: Task;
  @Column({ type: 'varchar', length: 64, default: ApprovalStatus.PENDING }) status: ApprovalStatus;
  @Column({ name: 'requested_by', nullable: true }) requestedBy: string;
  @Column({ name: 'reviewed_by', nullable: true }) reviewedBy: string;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'simple-json', nullable: true }) context: Record<string, unknown>;
  @Column({ name: 'reviewed_at', nullable: true }) reviewedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
