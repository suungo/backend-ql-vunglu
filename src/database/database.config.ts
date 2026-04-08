import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// Import trực tiếp tất cả entities để tránh lỗi glob trong dev mode
import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { HumanResource } from 'src/modules/human-resources/entities/human-resource.entity';
import { Resident } from 'src/modules/residents/entities/resident.entity';
import { Reflection } from 'src/modules/reflections/entities/reflection.entity';
import { Verification } from 'src/modules/verifications/entities/verification.entity';
import { Notification } from 'src/modules/notifications/entities/notification.entity';
import { Conversation } from 'src/modules/chats/entities/conversation.entity';
import { Message } from 'src/modules/chats/entities/message.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Media } from 'src/modules/media/entities/media.entity';

export const ALL_ENTITIES = [
  User,
  Role,
  HumanResource,
  Resident,
  Reflection,
  Verification,
  Notification,
  Conversation,
  Message,
  Post,
  Media,
];

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: ALL_ENTITIES,
    synchronize: configService.get<string>('DB_SYNC') === 'true',
    namingStrategy: new SnakeNamingStrategy(),
    logging: ['error'],
    // 🔐 SSL bắt buộc khi kết nối Supabase trên production
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};

