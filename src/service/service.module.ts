import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { Service } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategoryModule } from 'src/serviceCategory/serviceCategory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    ServiceModule,
    ServiceCategoryModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
})
export class ServiceModule {}
