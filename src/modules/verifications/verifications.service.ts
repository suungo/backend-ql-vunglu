import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVerificationDto, UpdateVerificationDto } from './dto/verification.dto';
import { Verification } from './entities/verification.entity';
import { VerificationStatus } from './enums/verification.enum';

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private readonly repo: Repository<Verification>,
  ) {}

  async create(dto: CreateVerificationDto, user_id: number) {
    const saved = await this.repo.save(this.repo.create({ ...dto, user_id }));
    return { statusCode: 201, message: 'Gửi yêu cầu xác minh thành công', data: saved };
  }

  async findAll(page = 1, limit = 10, status?: VerificationStatus) {
    const qb = this.repo.createQueryBuilder('v').leftJoinAndSelect('v.user', 'user');
    if (status) qb.andWhere('v.status = :status', { status });
    qb.orderBy('v.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findMyVerifications(userId: number, page = 1, limit = 10) {
    const [data, total] = await this.repo.findAndCount({
      where: { user_id: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const v = await this.repo.findOne({ where: { id }, relations: ['user'] });
    if (!v) throw new NotFoundException('Không tìm thấy yêu cầu xác minh');
    return { statusCode: 200, message: 'Thành công', data: v };
  }

  async update(id: number, dto: UpdateVerificationDto, reviewerId: number) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Không tìm thấy yêu cầu xác minh');
    if (dto.status && [VerificationStatus.APPROVED, VerificationStatus.REJECTED].includes(dto.status)) {
      v.reviewedAt = new Date();
      v.reviewedBy = reviewerId;
    }
    Object.assign(v, dto);
    return { statusCode: 200, message: 'Cập nhật thành công', data: await this.repo.save(v) };
  }

  async remove(id: number) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('Không tìm thấy yêu cầu xác minh');
    await this.repo.softDelete(id);
    return { statusCode: 200, message: 'Xóa thành công' };
  }
}
