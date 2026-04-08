import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ nullable: true })
  name?: string;

  @Column({ default: false })
  isGroup: boolean;

  @Column({ nullable: true, name: 'creator_id' })
  creatorId: number;

  @ManyToOne(() => User, (user) => user.conversations)
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];
}
