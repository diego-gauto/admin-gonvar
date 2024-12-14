import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { Role } from './entities/role.entity';
import { BaseService } from 'src/common/services/base.service';
import { RolePermission } from 'src/rolePermission/entities/rolePermission.entity';
import { UserCompanyRole } from 'src/userCompanyRole/entities/userCompanyRole.entity';

@Injectable()
export class RoleService extends BaseService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      // Verificar si existe un rol con el mismo nombre, incluyendo los eliminados lógicamente
      const existingRole = await this.roleRepository.findOne({
        where: { name: createRoleDto.name },
        withDeleted: true, // Incluir registros eliminados lógicamente
      });

      if (existingRole) {
        if (existingRole.deletedAt) {
          // Si existe pero está eliminado lógicamente, reactivarlo
          existingRole.deletedAt = null; // Restaurar el estado
          Object.assign(existingRole, createRoleDto); // Actualizar con los datos nuevos si es necesario
          console.log(
            `Reactivating logically deleted role: ${createRoleDto.name}`,
          );
          return await this.roleRepository.save(existingRole);
        }

        // Si no está eliminado, lanzar una excepción de conflicto
        console.warn(
          `Role already exists with this name: ${createRoleDto.name}`,
        );
        throw new ConflictException('A role with this name already exists');
      }

      // Crear un nuevo rol si no existe
      const newRole = this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getAllRoles(): Promise<Role[]> {
    try {
      const roles = await this.roleRepository.find();

      if (roles.length === 0) {
        const logMessage = 'No roles found';
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return roles;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getRoleById(roleId: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({ where: { roleId } });
      if (!role) {
        const logMessage = `Role with ID ${roleId} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }
      return role;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getIdRoleByName(name: string): Promise<number> {
    try {
      const role = await this.roleRepository.findOne({ where: { name } });
      if (!role) {
        const logMessage = `Role with name ${name} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }
      return role.roleId;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async updateRole(
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { roleId },
    });

    if (!existingRole) {
      const logMessage = `Role with ID ${roleId} not found`;
      console.warn(logMessage);
      throw new NotFoundException(logMessage);
    }

    // Prevent name duplication
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const duplicateRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (duplicateRole) {
        console.warn(
          `Role already exists with this name: ${updateRoleDto.name}`,
        );
        throw new ConflictException('A role with this name already exists');
      }
    }

    Object.assign(existingRole, updateRoleDto);

    try {
      return await this.roleRepository.save(existingRole);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async deleteRole(roleId: number): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner(); // Crear un queryRunner para manejar la transacción

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Borrar lógicamente el rol
      const result = await queryRunner.manager.softDelete(Role, roleId);

      if (result.affected === 0) {
        const logMessage = `Role with ID ${roleId} not found`;
        console.warn(logMessage); // Registrar advertencia si no se encontró el rol
        throw new NotFoundException(logMessage); // Lanzar excepción
      }

      // Borrar lógicamente los registros relacionados en RolePermission
      const rolePermissionResult = await queryRunner.manager.softDelete(
        RolePermission,
        {
          role: { roleId },
        },
      );
      console.log(
        `Deleted ${rolePermissionResult.affected} related RolePermission records logically`,
      );

      // Borrar lógicamente los registros relacionados en UserCompanyRole
      const userCompanyRoleResult = await queryRunner.manager.softDelete(
        UserCompanyRole,
        {
          role: { roleId },
        },
      );
      console.log(
        `Deleted ${userCompanyRoleResult.affected} related UserCompanyRole records logically`,
      );

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        message: `Role with id:${roleId}, along with related RolePermission and UserCompanyRole records, deleted successfully (logically)`,
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
