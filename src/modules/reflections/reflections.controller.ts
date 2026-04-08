import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleCode } from 'src/common/enums/role-code.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateReflectionDto, UpdateReflectionDto } from './dto/reflection.dto';
import { ReflectionStatus } from './enums/reflection.enum';
import { ReflectionsService } from './reflections.service';

@ApiTags('Phản ánh (Reflections)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ReflectionsController {
  constructor(private readonly service: ReflectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Gửi phản ánh / kiến nghị' })
  create(@Body() dto: CreateReflectionDto, @CurrentUser() user: any) {
    return this.service.create(dto, user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.MANAGER, RoleCode.STAFF)
  @ApiOperation({ summary: 'Danh sách phản ánh (Admin/Manager)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', enum: ReflectionStatus, required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('keyword') keyword?: string,
    @Query('status') status?: ReflectionStatus,
  ) {
    return this.service.findAll(+page, +limit, keyword, status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Phản ánh của tôi' })
  findMy(@CurrentUser() user: any, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findMyReflections(user.id, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phản ánh' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật / phản hồi phản ánh' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReflectionDto, @CurrentUser() user: any) {
    return this.service.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RoleCode.ADMIN)
  @ApiOperation({ summary: 'Xóa phản ánh' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(RoleCode.ADMIN, RoleCode.MANAGER)
  @ApiOperation({ summary: 'Cập nhật trạng thái phản ánh' })
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: { status: ReflectionStatus }) {
    return this.service.updateStatus(id, dto.status);
  }
}
