import { BaseEntity } from 'src/common/entities/base.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Message } from 'src/modules/chats/entities/message.entity';
import { Conversation } from 'src/modules/chats/entities/conversation.entity';
import { Reflection } from 'src/modules/reflections/entities/reflection.entity';
import { Post } from 'src/modules/posts/entities/post.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;

  @Column({ nullable: true })
  dateBirth: Date;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ nullable: true, name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany(() => Notification, (n) => n.user)
  notifications: Notification[];

  @OneToMany(() => Message, (m) => m.sender)
  messages: Message[];

  @OneToMany(() => Conversation, (c) => c.creator)
  conversations: Conversation[];

  @OneToMany(() => Reflection, (r) => r.user)
  reflections: Reflection[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
