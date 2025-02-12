import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Link } from './link.entity';

@Entity()
export class Visit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @CreateDateColumn()
  visitedAt: Date;

  @ManyToOne(() => Link, (link) => link.visits, { onDelete: 'CASCADE' })
  link: Link;
}
