import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReflectionDto, UpdateReflectionDto } from './dto/reflection.dto';
import { Reflection } from './entities/reflection.entity';
import { ReflectionStatus } from './enums/reflection.enum';

import { RoleCode } from 'src/common/enums/role-code.enum';

@Injectable()
export class ReflectionsService {
  constructor(
    @InjectRepository(Reflection)
    private readonly repo: Repository<Reflection>,
  ) {}

  async create(dto: CreateReflectionDto, currentUser: any) {
    const userId = currentUser.id;
    const title = dto.title || (dto.content?.substring(0, 80) + (dto.content?.length > 80 ? '...' : '')) || 'Báo cáo mới';
    
    const reflection = this.repo.create({ ...dto, userId, title });

    // Nếu là Quản lý phường (MANAGER) tạo thì trạng thái mặc định là Đã xử lý
    if (currentUser.roleCode === RoleCode.MANAGER) {
      reflection.status = ReflectionStatus.RESOLVED;
      reflection.response = 'Báo cáo được khởi tạo bởi Quản lý phường.';
      reflection.respondedAt = new Date();
    }

    const saved = await this.repo.save(reflection);
    return { statusCode: 200, message: 'Gửi phản ánh thành công', data: saved };
  }

  async findAll(page = 1, limit = 10, keyword?: string, status?: ReflectionStatus) {
    const qb = this.repo.createQueryBuilder('r').leftJoinAndSelect('r.user', 'user');
    if (keyword) qb.andWhere('(r.title LIKE :kw OR r.content LIKE :kw)', { kw: `%${keyword}%` });
    if (status) qb.andWhere('r.status = :status', { status });
    qb.orderBy('r.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findMyReflections(userId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!r) throw new NotFoundException('Không tìm thấy phản ánh');
    return { statusCode: 200, message: 'Thành công', data: r };
  }

  async update(id: number, dto: UpdateReflectionDto, userId: number) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy phản ánh');
    if (dto.content) { r.content = dto.content; }
    if (dto.category) { r.category = dto.category; }
    if (dto.description) { r.description = dto.description; }
    if (dto.lat) { r.lat = dto.lat; }
    if (dto.lng) { r.lng = dto.lng; }
    if (dto.address) { r.address = dto.address; }
    if (dto.imageUrl) { r.imageUrl = dto.imageUrl; }
    if (dto.priority) { r.priority = dto.priority; }
    if (dto.typeOfIncident) { r.typeOfIncident = dto.typeOfIncident; }
    if (dto.response) { 
      r.response = dto.response; 
      r.respondedAt = new Date();
    }
    Object.assign(r, dto);
    return { statusCode: 200, message: 'Cập nhật thành công', data: await this.repo.save(r) };
  }

  async remove(id: number) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy phản ánh');
    await this.repo.softDelete(id);
    return { statusCode: 200, message: 'Xóa thành công' };
  }

  async updateStatus(id: number, status: ReflectionStatus) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy phản ánh');
    r.status = status;
    return { statusCode: 200, message: 'Cập nhật thành công', data: await this.repo.save(r) };
  }
}
