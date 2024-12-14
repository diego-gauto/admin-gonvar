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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';
import { ServiceIdDto } from './dto/serviceId.dto';
import { Service } from './entities/service.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Service')
@ApiBearerAuth()
@Controller('service')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Crear un nuevo servicio
  @Post()
  async createService(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    return this.serviceService.createService(createServiceDto);
  }

  // Obtener todos los servicios
  @Get()
  async getAllServices(): Promise<Service[]> {
    return this.serviceService.getAllServices();
  }

  // Obtener un servicio específico por su ID
  @Get(':serviceId')
  async getServiceById(@Param() { serviceId }: ServiceIdDto): Promise<Service> {
    return this.serviceService.getServiceById(serviceId);
  }

  // Actualizar un servicio por su ID
  @Put(':serviceId')
  async updateService(
    @Param() { serviceId }: ServiceIdDto,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.serviceService.updateService(serviceId, updateServiceDto);
  }

  // Eliminar un servicio
  @Delete(':serviceId')
  @HttpCode(HttpStatus.OK)
  async deleteService(
    @Param() { serviceId }: ServiceIdDto,
  ): Promise<{ message: string }> {
    return this.serviceService.deleteService(serviceId);
  }
}
