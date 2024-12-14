import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './entities/serviceCategory.entity';
import { ServiceService } from '../service/service.service';
import { BaseService } from 'src/common/services/base.service'; // Asegúrate de que esta sea la ruta correcta
import { CreateServiceCategoryDto } from './dto/createServiceCategory.dto';
import { UpdateServiceCategoryDto } from './dto/updateServiceCategory.dto';

@Injectable()
export class ServiceCategoryService extends BaseService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {
    super(); // Llamamos al constructor de BaseService
  }

  // Crear una nueva categoría de servicio
  async createServiceCategory(
    createServiceCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const { name } = createServiceCategoryDto;

    try {
      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategory = await this.serviceCategoryRepository.findOne({
        where: { name },
      });
      if (existingCategory) {
        // Lanzar una excepción de conflicto si ya existe la categoría
        throw new ConflictException(
          `A service category with the name "${name}" already exists.`,
        );
      }

      // Crear la nueva categoría de servicio
      const newServiceCategory = this.serviceCategoryRepository.create(
        createServiceCategoryDto,
      );
      return await this.serviceCategoryRepository.save(newServiceCategory);
    } catch (error) {
      return this.handleServiceError(error); // Usar el método correcto para manejar el error
    }
  }

  // Obtener todas las categorías de servicio
  async getAllServiceCategory(): Promise<ServiceCategory[]> {
    try {
      const serviceCategories = await this.serviceCategoryRepository.find({
        relations: ['services'], // Incluir relaciones si es necesario
      });

      if (serviceCategories.length === 0) {
        const logMessage = 'No ServiceCategory records found';
        console.warn(logMessage); // Registrar advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción
      }

      return serviceCategories;
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }

  // Obtener una categoría de servicio por su ID
  async getServiceCategoryById(
    serviceCategoryId: number,
  ): Promise<ServiceCategory> {
    try {
      // Buscar la categoría de servicio por ID
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { serviceCategoryId },
        relations: ['services'], // Incluir relaciones si es necesario
      });

      // Verificar si la categoría existe
      if (!serviceCategory) {
        throw new NotFoundException(
          `ServiceCategory with ID "${serviceCategoryId}" not found.`,
        );
      }

      return serviceCategory;
    } catch (error) {
      // Manejo centralizado de errores
      this.handleServiceError(error);
    }
  }

  // Actualizar una categoría de servicio
  async updateServiceCategory(
    serviceCategoryId: number,
    updateServiceCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    try {
      // Buscar la categoría de servicio por ID
      const serviceCategory = await this.serviceCategoryRepository.findOne({
        where: { serviceCategoryId },
      });

      if (!serviceCategory) {
        // Lanzar una excepción de no encontrado si no se encuentra la categoría
        throw new NotFoundException(
          `ServiceCategory with ID ${serviceCategoryId} not found.`,
        );
      }

      // Verificar si el nombre viene en el DTO y si está repetido
      if (updateServiceCategoryDto.name) {
        const existingCategory = await this.serviceCategoryRepository.findOne({
          where: { name: updateServiceCategoryDto.name },
        });

        if (
          existingCategory &&
          existingCategory.serviceCategoryId !== serviceCategoryId
        ) {
          const logMessage = `ServiceCategory with name "${updateServiceCategoryDto.name}" already exists.`;
          console.warn(logMessage); // Registrar advertencia si el nombre está repetido
          throw new ConflictException(logMessage); // Lanzar excepción de conflicto
        }
      }

      // Actualizar la categoría con los datos proporcionados
      Object.assign(serviceCategory, updateServiceCategoryDto);

      return await this.serviceCategoryRepository.save(serviceCategory);
    } catch (error) {
      return this.handleServiceError(error); // Usar el método correcto para manejar el error
    }
  }

  // Eliminar una categoría de servicio
  async deleteServiceCategory(
    serviceCategoryId: number,
  ): Promise<{ message: string }> {
    try {
      const result =
        await this.serviceCategoryRepository.softDelete(serviceCategoryId);

      if (result.affected === 0) {
        const logMessage = `ServiceCategory with ID ${serviceCategoryId} not found`;
        console.warn(logMessage); // Registrar advertencia si no se encuentra el registro
        throw new NotFoundException(logMessage); // Lanzar excepción de no encontrado
      }

      return {
        message: `ServiceCategory with ID ${serviceCategoryId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }
}
