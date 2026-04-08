import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Category, EventType, Priority, ReflectionStatus } from '../enums/reflection.enum';

@Entity('reflections')
export class Reflection extends BaseEntity {
  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: Category,
    default: Category.OTHER,
  })
  category: Category;

  @Column({
    type: 'enum',
    enum: ReflectionStatus,
    default: ReflectionStatus.PENDING,
  })
  status: ReflectionStatus;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.LOW,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: EventType,
    default: EventType.OTHER,
  })
  typeOfIncident: EventType;

  @Column({ type: 'float', nullable: true })
  lat?: number;

  @Column({ type: 'float', nullable: true })
  lng?: number;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.reflections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'simple-array', nullable: true })
  imageUrl?: string[];

  @Column({ type: 'text', nullable: true })
  response?: string;

  @Column({ type: 'timestamp', nullable: true })
  respondedAt?: Date;
}
