import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum EpicStatus { OPEN='open', IN_PROGRESS='in_progress', COMPLETED='completed', CANCELLED='cancelled' }

@Entity('epics')
export class Epic {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 255 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'project_id' }) projectId: string;
  @ManyToOne(() => Project, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'project_id' }) project: Project;
  @Column({ type: 'varchar', length: 64, default: EpicStatus.OPEN }) status: EpicStatus;
  @Column({ type: 'int', nullable: true }) order: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
