import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserCompanyRole } from './entities/userCompanyRole.entity';
import { CreateUserCompanyRoleDto } from './dto/createUserCompanyRole.dto';
import { UpdateUserCompanyRoleDto } from './dto/updateUserCompanyRole.dto';
import { BaseService } from 'src/common/services/base.service';
import { UserService } from 'src/user/user.service';
import { CompanyService } from 'src/company/company.service';
import { RoleService } from 'src/role/role.service';
import { User } from 'src/user/entities/user.entity';
import { Company } from 'src/company/entities/company.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UserCompanyRoleService extends BaseService {
  constructor(
    @InjectRepository(UserCompanyRole)
    private readonly userCompanyRoleRepository: Repository<UserCompanyRole>,
    private readonly userService: UserService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    private readonly roleService: RoleService,
  ) {
    super();
  }

  /**
   * Crea una nueva relación UserCompanyRole
   */
  async createUserCompanyRoleTransaction(
    createUserCompanyRole: CreateUserCompanyRoleDto,
    queryRunner: QueryRunner,
  ): Promise<UserCompanyRole> {
    try {
      const { userId, companyId, roleId } = createUserCompanyRole;

      // Validar que userId y companyId existen, usando el queryRunner
      const user = await queryRunner.manager.findOne(User, {
        where: { userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID "${userId}" not found.`);
      }

      const company = await queryRunner.manager.findOne(Company, {
        where: { companyId },
      });
      if (!company) {
        throw new NotFoundException(
          `Company with ID "${companyId}" not found.`,
        );
      }

      if (!roleId) {
        // Caso 1: Si roleId no está presente
        const existingRecord = await queryRunner.manager.findOne(
          UserCompanyRole,
          {
            where: { user: { userId }, company: { companyId }, role: null },
          },
        );

        if (existingRecord) {
          // Ya existe un registro activo para este usuario y compañía
          throw new ConflictException(
            `User with ID "${userId}" is already assigned to company with ID "${companyId}".`,
          );
        }

        // Crear registro solo con userId y companyId
        const newUserCompanyRole = queryRunner.manager.create(UserCompanyRole, {
          user,
          company,
          role: null,
        });

        return await queryRunner.manager.save(
          UserCompanyRole,
          newUserCompanyRole,
        );
      }

      // Caso 2: Si roleId está presente
      const role = await queryRunner.manager.findOne(Role, {
        where: { roleId },
      });
      if (!role) {
        throw new NotFoundException(`Role with ID "${roleId}" not found.`);
      }

      const existingRoleRecord = await queryRunner.manager.findOne(
        UserCompanyRole,
        {
          where: {
            user: { userId },
            company: { companyId },
            role: { roleId },
          },
          withDeleted: true, // Incluir registros borrados lógicamente
        },
      );

      if (existingRoleRecord?.deletedAt) {
        // Reactivar el registro eliminado lógicamente
        existingRoleRecord.deletedAt = null;
        return await queryRunner.manager.save(
          UserCompanyRole,
          existingRoleRecord,
        );
      }

      if (existingRoleRecord) {
        // Ya existe un registro activo
        throw new ConflictException(
          `A record with userId "${userId}", companyId "${companyId}", and roleId "${roleId}" already exists.`,
        );
      }

      // Crear un nuevo registro con userId, companyId y roleId
      const newUserCompanyRole = queryRunner.manager.create(UserCompanyRole, {
        user,
        company,
        role,
      });

      return await queryRunner.manager.save(
        UserCompanyRole,
        newUserCompanyRole,
      );
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getAllUsersCompanyRole(): Promise<UserCompanyRole[]> {
    try {
      const userCompanyRoles = await this.userCompanyRoleRepository.find({
        relations: ['user', 'company', 'role'], // Incluye relaciones relevantes
      });

      if (userCompanyRoles.length === 0) {
        const logMessage = 'No UserCompanyRole records found';
        console.warn(logMessage); // Registrar un mensaje de advertencia
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente
      }

      return userCompanyRoles;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getAllUsersCompanyRoleByCompanyId(
    companyId: number,
  ): Promise<UserCompanyRole[]> {
    try {
      // Validar que el companyId existe usando el servicio de Company
      const company = await this.companyService.getCompanyById(companyId);
      if (!company) {
        throw new NotFoundException(
          `Company with ID "${companyId}" not found.`,
        );
      }

      // Obtener los registros asociados a este companyId
      const usersCompanyRole = await this.userCompanyRoleRepository.find({
        where: { company: { companyId } },
        relations: ['user', 'role', 'company'], // Ajustar según las relaciones definidas
      });

      if (usersCompanyRole.length === 0) {
        throw new NotFoundException(
          `No user-company-role assignments found for company with ID "${companyId}".`,
        );
      }

      return usersCompanyRole;
    } catch (error) {
      // Llamar al método base para manejar errores
      this.handleServiceError(error);
    }
  }
  /**
   * Obtiene una relación UserCompanyRole por su ID
   */
  async getUserCompanyRoleById(
    userCompanyRoleId: number,
  ): Promise<UserCompanyRole> {
    try {
      // Buscar el registro por ID
      const userCompanyRole = await this.userCompanyRoleRepository.findOne({
        where: { userCompanyRoleId },
        relations: ['user', 'role', 'company'], // Ajustar según las relaciones necesarias
      });

      if (!userCompanyRole) {
        const logMessage = `User-company-role assignment with ID "${userCompanyRoleId}" not found.`;
        console.warn(logMessage); // Registrar mensaje en log de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción correspondiente
      }

      return userCompanyRole;
    } catch (error) {
      // Manejar el error llamando al método base
      this.handleServiceError(error);
    }
  }

  /**
   * Actualiza una relación UserCompanyRole por su ID
   */
  async updateUserCompanyRole(
    userCompanyRoleId: number,
    updateUserCompanyRoleDto: UpdateUserCompanyRoleDto,
  ): Promise<UserCompanyRole> {
    try {
      const { userId, companyId, roleId } = updateUserCompanyRoleDto;

      // Obtener la asignación de UserCompanyRole
      const existingUserCompanyRole =
        await this.userCompanyRoleRepository.findOne({
          where: { userCompanyRoleId },
          relations: ['user', 'company', 'role'],
        });

      if (!existingUserCompanyRole) {
        const logMessage = `User-company-role assignment with ID "${userCompanyRoleId}" not found.`;
        console.warn(logMessage); // Log de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción de no encontrado
      }

      // Verificar si el userId y companyId son válidos y existen, usando los servicios del módulo
      const user = await this.userService.getUserById(userId); // Servicio de Users
      if (!user) {
        const logMessage = `User with ID "${userId}" not found.`;
        console.warn(logMessage); // Log de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción de no encontrado
      }

      const company = await this.companyService.getCompanyById(companyId); // Servicio de Companies
      if (!company) {
        const logMessage = `Company with ID "${companyId}" not found.`;
        console.warn(logMessage); // Log de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción de no encontrado
      }

      // Si roleId está presente, validarlo, usando el servicio de Roles
      let role = null;
      if (roleId) {
        role = await this.roleService.getRoleById(roleId); // Servicio de Roles
        if (!role) {
          const logMessage = `Role with ID "${roleId}" not found.`;
          console.warn(logMessage); // Log de advertencia
          throw new NotFoundException(logMessage); // Lanzar excepción de no encontrado
        }
      }

      // Actualizar el registro de UserCompanyRole
      existingUserCompanyRole.user = user;
      existingUserCompanyRole.company = company;
      existingUserCompanyRole.role = role || null; // Asignar null si no se pasa roleId

      // Guardar el registro actualizado
      return await this.userCompanyRoleRepository.save(existingUserCompanyRole);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  /**
   * Elimina (soft delete) una relación UserCompanyRole por su ID
   */
  async deleteUserCompanyRole(
    userCompanyRoleId: number,
  ): Promise<{ message: string }> {
    try {
      // Realizar el borrado lógico utilizando softDelete directamente con el ID
      const result =
        await this.userCompanyRoleRepository.softDelete(userCompanyRoleId);

      if (result.affected === 0) {
        const logMessage = `User-company-role assignment with ID "${userCompanyRoleId}" not found.`;
        console.warn(logMessage); // Log de advertencia
        throw new NotFoundException(logMessage); // Lanzar excepción si no se encontró
      }

      return {
        message: `User-company-role with ID "${userCompanyRoleId}" deleted logically.`,
      };
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }

  async isUserOwner(userId: string): Promise<boolean> {
    const existingOwner = await this.userCompanyRoleRepository.findOne({
      where: {
        user: { userId: userId },
        role: { description: 'owner' },
      },
      relations: ['user', 'role'],
    });

    return !!existingOwner;
  }
}
