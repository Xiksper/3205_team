import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Visit } from './visit.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortUrl: string;

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Visit, (visit) => visit.link, { cascade: true })
  visits: Visit[];
}
