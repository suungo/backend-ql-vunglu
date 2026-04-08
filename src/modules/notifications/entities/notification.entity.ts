import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  referenceId?: number;

  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
