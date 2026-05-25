import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

export enum ProjectStatus { ACTIVE='active', PAUSED='paused', COMPLETED='completed', ARCHIVED='archived' }

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 255 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'varchar', length: 64, default: ProjectStatus.ACTIVE }) status: ProjectStatus;
  @Column({ type: 'simple-json', nullable: true }) metadata: Record<string, unknown>;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
