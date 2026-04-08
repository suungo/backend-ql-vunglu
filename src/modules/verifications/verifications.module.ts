import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verification } from './entities/verification.entity';
import { VerificationsService } from './verifications.service';
import { VerificationsController } from './verifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Verification])],
  controllers: [VerificationsController],
  providers: [VerificationsService],
  exports: [VerificationsService],
})
export class VerificationsModule {}
