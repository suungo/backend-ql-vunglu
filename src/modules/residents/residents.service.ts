import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateResidentDto, UpdateResidentDto } from './dto/resident.dto';
import { Resident } from './entities/resident.entity';
import { HasBusiness, HasChildren, HasElderly, HasPregnant, HasSick, HouseType } from './enums/resident.enum';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private readonly repo: Repository<Resident>,
  ) {}

  async create(dto: CreateResidentDto) {
    const existing = await this.repo.findOne({ where: { residentCode: dto.residentCode } });
    if (existing) throw new BadRequestException('Mã hộ dân đã tồn tại');
    const existingPhone = await this.repo.findOne({ where: { phoneNumber: dto.phoneNumber } });
    if (existingPhone) throw new BadRequestException('Số điện thoại đã tồn tại');
    const existingEmail = await this.repo.findOne({ where: { email: dto.email } });
    if (existingEmail) throw new BadRequestException('Email đã tồn tại');

    const saved = await this.repo.save(this.repo.create(dto));
    return { statusCode: 201, message: 'Thêm hộ dân thành công', data: saved };
  }

  async findAll(page = 1, limit = 10, keyword?: string, houseType?: HouseType, hasElderly?: HasElderly, hasChildren?: HasChildren, hasPregnantWomen?: HasPregnant, hasChronicDisease?: HasSick, hasBusiness?: HasBusiness) {
    const baseWhere: any = {};
    if (houseType) {
      baseWhere.houseType = houseType;
    }
    if (hasElderly) {
      baseWhere.hasElderly = hasElderly;
    }
    if (hasChildren) {
      baseWhere.hasChildren = hasChildren;
    }
    if (hasPregnantWomen) {
      baseWhere.hasPregnantWomen = hasPregnantWomen;
    }
    if (hasChronicDisease) {
      baseWhere.hasChronicDisease = hasChronicDisease;
    }
    if (hasBusiness) {
      baseWhere.hasBusiness = hasBusiness;
    }

    let where: any = baseWhere;
    if (keyword) {
      where = [
        { ...baseWhere, fullName: Like(`%${keyword}%`) },
        { ...baseWhere, residentCode: Like(`%${keyword}%`) },
        { ...baseWhere, phoneNumber: Like(`%${keyword}%`) }
      ];
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { statusCode: 200, message: 'Thành công', data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy cư dân');
    return { statusCode: 200, message: 'Thành công', data: r };
  }

  async update(id: number, dto: UpdateResidentDto) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy cư dân');
    Object.assign(r, dto);
    return { statusCode: 200, message: 'Cập nhật thành công', data: await this.repo.save(r) };
  }

  async remove(id: number) {
    const r = await this.repo.findOne({ where: { id } });
    if (!r) throw new NotFoundException('Không tìm thấy cư dân');
    await this.repo.softDelete(id);
    return { statusCode: 200, message: 'Xóa thành công' };
  }
}
