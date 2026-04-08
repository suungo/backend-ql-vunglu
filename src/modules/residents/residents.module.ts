import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resident } from './entities/resident.entity';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Resident])],
  controllers: [ResidentsController],
  providers: [ResidentsService],
  exports: [ResidentsService],
})
export class ResidentsModule {}
