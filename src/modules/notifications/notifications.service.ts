import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) {}

  async create(data: { userId: number; title: string; content: string; type?: string; referenceId?: number }) {
    const n = this.repo.create(data);
    return await this.repo.save(n);
  }

  async findByUser(userId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async markRead(id: number, userId: number) {
    await this.repo.update({ id, userId }, { isRead: true });
    return { statusCode: 200, message: 'Đánh dấu đã đọc' };
  }

  async markAllRead(userId: number) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
    return { statusCode: 200, message: 'Đã đọc tất cả thông báo' };
  }

  async countUnread(userId: number) {
    const count = await this.repo.count({ where: { userId, isRead: false } });
    return { statusCode: 200, message: 'Thành công', data: { unread: count } };
  }
}
