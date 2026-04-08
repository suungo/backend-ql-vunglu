import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reflection } from './entities/reflection.entity';
import { ReflectionsService } from './reflections.service';
import { ReflectionsController } from './reflections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reflection])],
  controllers: [ReflectionsController],
  providers: [ReflectionsService],
  exports: [ReflectionsService],
})
export class ReflectionsModule {}
