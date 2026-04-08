import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from 'src/modules/posts/entities/post.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'postId', nullable: true })
  postId: number;

  @Column({ type: 'text', nullable: true })
  url: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  type: MediaType;

  @ManyToOne(() => Post, (post) => post.media)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
