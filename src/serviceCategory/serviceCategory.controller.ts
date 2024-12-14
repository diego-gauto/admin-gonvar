import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ServiceCategoryService } from './serviceCategory.service';
import { CreateServiceCategoryDto } from './dto/createServiceCategory.dto';
import { UpdateServiceCategoryDto } from './dto/updateServiceCategory.dto';
import { ServiceCategoryIdDto } from './dto/serviceCategoryId.dto';
import { ServiceCategory } from './entities/serviceCategory.entity';
import { Service } from '../service/entities/service.entity'; // Asegúrate de tener importado el modelo de servicio
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('ServiceCategory')
@ApiBearerAuth()
@Controller('serviceCategory')
export class ServiceCategoryController {
  constructor(
    private readonly serviceCategoryService: ServiceCategoryService,
  ) {}

  // Crear una nueva categoría de servicio
  @Post()
  async createServiceCategory(
    @Body() createServiceCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoryService.createServiceCategory(
      createServiceCategoryDto,
    );
  }

  // Obtener todas las categorías de servicio
  @Get()
  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return this.serviceCategoryService.getAllServiceCategory();
  }

  // Obtener una categoría específica por su ID
  @Get(':serviceCategoryId')
  async getServiceCategoryById(
    @Param() { serviceCategoryId }: ServiceCategoryIdDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoryService.getServiceCategoryById(
      serviceCategoryId,
    );
  }

  // Actualizar una categoría de servicio por su ID
  @Put(':serviceCategoryId')
  async updateServiceCategory(
    @Param() { serviceCategoryId }: ServiceCategoryIdDto,
    @Body() updateServiceCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    return this.serviceCategoryService.updateServiceCategory(
      serviceCategoryId,
      updateServiceCategoryDto,
    );
  }

  // Eliminar una categoría de servicio
  @Delete(':serviceCategoryId')
  @HttpCode(HttpStatus.OK)
  async deleteServiceCategory(
    @Param() { serviceCategoryId }: ServiceCategoryIdDto,
  ): Promise<{ message: string }> {
    return this.serviceCategoryService.deleteServiceCategory(serviceCategoryId);
  }
}
