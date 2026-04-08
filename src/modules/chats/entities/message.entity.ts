import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true, name: 'sender_id' })
  senderId: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column({ nullable: true, name: 'conversation_id' })
  conversationId: number;

  @ManyToOne(() => Conversation, (c) => c.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;
}
