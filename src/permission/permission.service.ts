import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { Permission } from './entities/permission.entity';
import { BaseService } from 'src/common/services/base.service';
import { RolePermission } from 'src/rolePermission/entities/rolePermission.entity';

@Injectable()
export class PermissionService extends BaseService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    try {
      // Verificar si existe un permiso con el mismo nombre
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: createPermissionDto.name },
        withDeleted: true, // Incluir registros eliminados lógicamente
      });

      if (existingPermission) {
        if (existingPermission.deletedAt) {
          // Si existe pero está eliminado lógicamente, reactivarlo
          existingPermission.deletedAt = null; // Restaurar el estado
          Object.assign(existingPermission, createPermissionDto); // Actualizar con los datos nuevos si es necesario
          console.log(
            `Reactivating logically deleted permission: ${createPermissionDto.name}`,
          );
          return await this.permissionRepository.save(existingPermission);
        }

        // Si no está eliminado, lanzar una excepción de conflicto
        console.warn(
          `Permission already exists with this name: ${createPermissionDto.name}`,
        );
        throw new ConflictException(
          'A permission with this name already exists',
        );
      }

      // Crear un nuevo permiso si no existe
      const newPermission =
        this.permissionRepository.create(createPermissionDto);
      return await this.permissionRepository.save(newPermission);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getAllPermissions(): Promise<Permission[]> {
    try {
      const permissions = await this.permissionRepository.find();

      if (permissions.length === 0) {
        const logMessage = 'No permissions found';
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return permissions;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getPermissionById(permissionId: number): Promise<Permission> {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { permissionId },
      });
      if (!permission) {
        const logMessage = `Permission with ID ${permissionId} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }
      return permission;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async updatePermission(
    permissionId: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const existingPermission = await this.permissionRepository.findOne({
      where: { permissionId },
    });

    if (!existingPermission) {
      const logMessage = `Permission with ID ${permissionId} not found`;
      console.warn(logMessage);
      throw new NotFoundException(logMessage);
    }

    // Prevent name duplication
    if (
      updatePermissionDto.name &&
      updatePermissionDto.name !== existingPermission.name
    ) {
      const duplicatePermission = await this.permissionRepository.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (duplicatePermission) {
        console.warn(
          `Permission already exists with this name: ${updatePermissionDto.name}`,
        );
        throw new ConflictException(
          'A permission with this name already exists',
        );
      }
    }

    Object.assign(existingPermission, updatePermissionDto);

    try {
      return await this.permissionRepository.save(existingPermission);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async deletePermission(permissionId: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner(); // Crear un queryRunner para la transacción

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Borrar lógicamente el permiso
      const result = await queryRunner.manager.softDelete(
        Permission,
        permissionId,
      );

      if (result.affected === 0) {
        const logMessage = `Permission with ID ${permissionId} not found`;
        console.warn(logMessage); // Registrar que no se encontró el permiso
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
      }

      // Borrar lógicamente los registros relacionados en RolePermission
      const rolePermissionResult = await queryRunner.manager.softDelete(
        RolePermission,
        {
          permission: { permissionId }, // Asegurarse de referenciar correctamente la relación
        },
      );

      console.log(
        `Deleted ${rolePermissionResult.affected} related RolePermission records logically`,
      );

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        message: `Permission with id:${permissionId} and related RolePermission records deleted successfully (logically)`,
      };
    } catch (error) {
      // Revertir la transacción en caso de error
      await queryRunner.rollbackTransaction();
      this.handleServiceError(error);
    } finally {
      // Liberar el queryRunner
      await queryRunner.release();
    }
  }
}
