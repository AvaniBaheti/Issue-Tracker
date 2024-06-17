import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IssueStatus } from './IssueStatus';  
import { User } from './user'; 

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  priority: string; 
  
  @ManyToOne(() => User)
  assignee: User;

  @Column({
    type: 'enum',
    enum: IssueStatus,
    default: IssueStatus.OPEN
  })
  status: IssueStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

