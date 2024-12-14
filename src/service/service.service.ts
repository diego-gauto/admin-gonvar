import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/createService.dto';
import { UpdateServiceDto } from './dto/updateService.dto';
import { ServiceCategoryService } from '../serviceCategory/serviceCategory.service';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class ServiceService extends BaseService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    private readonly serviceCategoryService: ServiceCategoryService,
  ) {
    super();
  }

  // Crear un nuevo servicio
  async createService(createServiceDto: CreateServiceDto): Promise<Service> {
    const { name, serviceCategoryId } = createServiceDto;

    try {
      // Verificar si ya existe un servicio con el mismo nombre
      const existingService = await this.serviceRepository.findOne({
        where: { name },
        withDeleted: true,
      });

      if (existingService) {
        if (existingService.deletedAt) {
          // Reactivar el servicio eliminado
          existingService.deletedAt = null;
          Object.assign(existingService, createServiceDto);
          return await this.serviceRepository.save(existingService);
        } else {
          throw new ConflictException(
            `A service with the name "${name}" already exists.`,
          );
        }
      }

      // Verificar si la categoría de servicio existe
      const serviceCategory =
        await this.serviceCategoryService.getServiceCategoryById(
          serviceCategoryId,
        );

      // Crear y guardar el nuevo servicio
      const newService = this.serviceRepository.create({
        ...createServiceDto,
        serviceCategory,
      });
      return await this.serviceRepository.save(newService);
    } catch (error) {
      return this.handleServiceError(error);
    }
  }

  // Obtener todos los servicios
  async getAllServices(): Promise<Service[]> {
    try {
      const services = await this.serviceRepository.find({
        relations: ['serviceCategory'],
      });

      if (services.length === 0) {
        throw new NotFoundException('No Service records found.');
      }

      return services;
    } catch (error) {
      return this.handleServiceError(error);
    }
  }

  // Obtener un servicio por su ID
  async getServiceById(serviceId: number): Promise<Service> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { serviceId },
        relations: ['serviceCategory'],
      });

      if (!service) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }

      return service;
    } catch (error) {
      return this.handleServiceError(error);
    }
  }

  // Actualizar un servicio
  async updateService(
    serviceId: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const { name, serviceCategoryId } = updateServiceDto;

    try {
      // Buscar el servicio por su ID
      const service = await this.serviceRepository.findOne({
        where: { serviceId },
      });

      if (!service) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }

      // Verificar si el nombre está duplicado
      if (name) {
        const existingService = await this.serviceRepository.findOne({
          where: { name },
        });
        if (existingService && existingService.serviceId !== serviceId) {
          throw new ConflictException(
            `A service with the name "${name}" already exists.`,
          );
        }
      }

      // Verificar si la nueva categoría existe
      if (serviceCategoryId) {
        const serviceCategory =
          await this.serviceCategoryService.getServiceCategoryById(
            serviceCategoryId,
          );
        service.serviceCategory = serviceCategory;
      }

      // Actualizar el servicio
      Object.assign(service, updateServiceDto);
      return await this.serviceRepository.save(service);
    } catch (error) {
      return this.handleServiceError(error);
    }
  }

  // Eliminar un servicio
  async deleteService(serviceId: number): Promise<{ message: string }> {
    try {
      const result = await this.serviceRepository.softDelete(serviceId);

      if (result.affected === 0) {
        throw new NotFoundException(
          `Service with ID "${serviceId}" not found.`,
        );
      }

      return {
        message: `Service with ID "${serviceId}" deleted successfully.`,
      };
    } catch (error) {
      return this.handleServiceError(error);
    }
  }
}
