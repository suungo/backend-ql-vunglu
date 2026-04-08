import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Media } from 'src/modules/media/entities/media.entity';

export enum PostType {
  EMERGENCY = 'emergency',
  WARNING = 'warning',
  NORMAL = 'normal',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, default: PostType.NORMAL })
  type: PostType;

  @Column({ type: 'varchar', length: 20, default: PostStatus.PUBLISHED })
  status: PostStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: any;

  @ManyToOne(() => Post, (post) => post.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Post;

  @OneToMany(() => Post, (post) => post.parent)
  children: Post[];

  @OneToMany(() => Media, (media) => media.post)
  media: Media[];
}
