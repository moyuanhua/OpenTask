import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('agent_events')
@Index(['taskId', 'createdAt'])
export class AgentEvent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'task_id', nullable: true }) @Index() taskId: string;
  @Column({ name: 'project_id', nullable: true }) projectId: string;
  @Column({ type: 'varchar', length: 64 }) type: string;
  @Column({ type: 'simple-json', nullable: true }) payload: Record<string, unknown>;
  @Column({ name: 'agent_id', nullable: true }) agentId: string;
  @Column({ nullable: true }) provider: string;
  @CreateDateColumn() createdAt: Date;
}
