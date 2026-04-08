import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Vai trò (Roles)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách vai trò' })
  findAll() {
    return this.rolesService.findAll();
  }
}
