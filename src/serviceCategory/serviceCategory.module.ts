import { Module } from '@nestjs/common';
import { ServiceCategoryService } from './serviceCategory.service';
import { ServiceCategoryController } from './serviceCategory.controller';
import { ServiceCategory } from './entities/serviceCategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory])],
  controllers: [ServiceCategoryController],
  providers: [ServiceCategoryService],
  exports: [ServiceCategoryService],
})
export class ServiceCategoryModule {}
