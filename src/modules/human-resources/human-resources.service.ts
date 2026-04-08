import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateHumanResourceDto } from './dto/create-human-resource.dto';
import { UpdateHumanResourceDto } from './dto/update-human-resource.dto';
import { HumanResource } from './entities/human-resource.entity';
import { HumanResourceStatus } from './enums/human-resource.enum';

@Injectable()
export class HumanResourcesService {
  constructor(
    @InjectRepository(HumanResource)
    private readonly repo: Repository<HumanResource>,
  ) {}

  async create(dto: CreateHumanResourceDto) {
    const existingCode = await this.repo.findOne({
      where: [
        { employeeCode: dto.employeeCode },

      ],
    });
    if (existingCode) throw new BadRequestException('Mã nhân viên đã tồn tại');

    const existingPhoneNumber = await this.repo.findOne({
      where: [

        { phoneNumber: dto.phoneNumber },

      ],
    });
    if (existingPhoneNumber) throw new BadRequestException('Số điện thoại đã tồn tại');

    const existingEmail = await this.repo.findOne({
      where: [
        {
          email: dto.email
        }
      ],
    });
    if (existingEmail) throw new BadRequestException('Email đã tồn tại');

    const hr = this.repo.create(dto);
    const saved = await this.repo.save(hr);
    return { statusCode: 201, message: 'Thêm nhân sự thành công', data: saved };
  }

  async findAll(
  page: number = 1,
  limit: number = 10,
  keyword?: string,           // optional
  status?: HumanResourceStatus   // ← Thêm ? để thành optional
) {
  const where: any = {};

  // Xử lý tìm kiếm theo keyword
  if (keyword && keyword.trim() !== '') {
    where.OR = [
      { fullName: Like(`%${keyword.trim()}%`) },
      { employeeCode: Like(`%${keyword.trim()}%`) },
      // thêm các trường khác nếu cần
    ];
  }

  // Xử lý lọc theo status
  if (status) {
    where.status = status;
  }

  const [data, total] = await this.repo.findAndCount({
    where,
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return {
    statusCode: 200,
    message: 'Thành công',
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async findOne(id: number) {
    const hr = await this.repo.findOne({ where: { id } });
    if (!hr) throw new NotFoundException('Không tìm thấy nhân sự');
    return { statusCode: 200, message: 'Thành công', data: hr };
  }

  async update(id: number, dto: UpdateHumanResourceDto) {
    const hr = await this.repo.findOne({ where: { id } });
    if (!hr) throw new NotFoundException('Không tìm thấy nhân sự');
    Object.assign(hr, dto);
    const saved = await this.repo.save(hr);
    return { statusCode: 200, message: 'Cập nhật thành công', data: saved };
  }

  async remove(id: number) {
    const hr = await this.repo.findOne({ where: { id } });
    if (!hr) throw new NotFoundException('Không tìm thấy nhân sự');
    await this.repo.softDelete(id);
    return { statusCode: 200, message: 'Xóa nhân sự thành công' };
  }
}
