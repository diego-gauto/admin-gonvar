import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolePermissionDto } from './dto/createRolePermission.dto';
import { RolePermission } from './entities/rolePermission.entity';
import { BaseService } from 'src/common/services/base.service';
import { RoleService } from 'src/role/role.service';
import { PermissionService } from 'src/permission/permission.service';

@Injectable()
export class RolePermissionService extends BaseService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) {
    super();
  }

  async createRolePermission(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const { roleId, permissionId } = createRolePermissionDto;

    // Validar que el Role exista
    const role = await this.roleService.getRoleById(roleId);
    if (!role) {
      throw new NotFoundException(`Role with ID "${roleId}" not found.`);
    }

    // Validar que el Permission exista
    const permission =
      await this.permissionService.getPermissionById(permissionId);
    if (!permission) {
      throw new NotFoundException(
        `Permission with ID "${permissionId}" not found.`,
      );
    }

    // Verificar si ya existe un registro con el mismo Role y Permission (incluyendo eliminados lógicamente)
    const existingRecord = await this.rolePermissionRepository.findOne({
      where: {
        role: { roleId },
        permission: { permissionId },
      },
      withDeleted: true, // Incluir registros eliminados lógicamente
    });

    if (existingRecord) {
      if (existingRecord.deletedAt) {
        // Si existe pero está eliminado lógicamente, reactivarlo
        existingRecord.deletedAt = null; // Restaurar el estado
        console.log(
          `Reactivating logically deleted record with roleId "${roleId}" and permissionId "${permissionId}".`,
        );
        return await this.rolePermissionRepository.save(existingRecord);
      }

      // Si no está eliminado, lanzar una excepción de conflicto
      throw new BadRequestException(
        `A record with roleId "${roleId}" and permissionId "${permissionId}" already exists.`,
      );
    }

    // Crear el nuevo registro si no existe
    const newRolePermission = this.rolePermissionRepository.create({
      role,
      permission,
    });

    return await this.rolePermissionRepository.save(newRolePermission);
  }

  async getAllRolePermissions(): Promise<RolePermission[]> {
    try {
      const rolePermissions = await this.rolePermissionRepository.find({
        relations: ['role', 'permission'], // Incluye las relaciones necesarias
      });

      if (rolePermissions.length === 0) {
        const logMessage = 'No RolePermission records found';
        console.warn(logMessage); // Registrar un mensaje de advertencia
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
      }

      return rolePermissions;
    } catch (error) {
      this.handleServiceError(error); // Manejo de errores reutilizable
    }
  }

  async getRolePermissionById(
    rolePermissionId: number,
  ): Promise<RolePermission> {
    try {
      const rolePermission = await this.rolePermissionRepository.findOne({
        where: { rolePermissionId },
        relations: ['role', 'permission'], // Incluye las relaciones necesarias
      });

      if (!rolePermission) {
        const logMessage = `RolePermission with ID "${rolePermissionId}" not found`;
        console.warn(logMessage); // Registrar un mensaje de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción si no se encuentra
      }

      return rolePermission;
    } catch (error) {
      this.handleServiceError(error); // Manejo de errores reutilizable
    }
  }

  async getRolePermissionsByRoleId(roleId: number): Promise<RolePermission[]> {
    try {
      // Verificar que el role exista utilizando el servicio correspondiente
      const role = await this.roleService.getRoleById(roleId);

      if (!role) {
        const logMessage = `Role with ID "${roleId}" not found`;
        console.warn(logMessage); // Registrar advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción si no existe
      }

      // Buscar los RolePermissions asociados al roleId
      const rolePermissions = await this.rolePermissionRepository.find({
        where: { role: { roleId } },
        relations: ['role', 'permission'], // Incluir relaciones necesarias
      });

      if (rolePermissions.length === 0) {
        const logMessage = `No RolePermissions found for Role with ID "${roleId}"`;
        console.warn(logMessage); // Registrar advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción si no se encuentran registros
      }

      return rolePermissions;
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }

  // update(id: number, updateRolePermissionDto: UpdateRolePermissionDto) {
  //   return `This action updates a #${id} rolePermission`;
  // }

  async deleteRolePermission(
    rolePermissionId: number,
  ): Promise<{ message: string }> {
    try {
      const result =
        await this.rolePermissionRepository.softDelete(rolePermissionId);

      if (result.affected === 0) {
        const logMessage = `RolePermission with ID ${rolePermissionId} not found`;
        console.warn(logMessage); // Registrar advertencia si no se encuentra el registro
        throw new NotFoundException(logMessage); // Lanzar excepción
      }

      return {
        message: `RolePermission with ID ${rolePermissionId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }
}
