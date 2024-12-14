import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/services/base.service';
import { UserMembership } from './entities/userMembership.entity';
import { CreateUserMembershipDto } from './dto/createUserMembership.dto';
import { UserService } from '../user/user.service';
import { MembershipService } from '../membership/membership.service';
import { User } from 'src/user/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';

@Injectable()
export class UserMembershipService extends BaseService {
  constructor(
    @InjectRepository(UserMembership)
    private readonly userMembershipRepository: Repository<UserMembership>,
    private readonly userService: UserService,
    private readonly membershipService: MembershipService,
  ) {
    super();
  }

  // Crear una nueva relación de User y Membership
  async createUserMembership(
    createUserMembershipDto: CreateUserMembershipDto,
  ): Promise<UserMembership> {
    const { userId, membershipId } = createUserMembershipDto;

    // Validar que el User exista
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    // Validar que el Membership exista
    const membership =
      await this.membershipService.getMembershipById(membershipId);
    if (!membership) {
      throw new NotFoundException(
        `Membership with ID "${membershipId}" not found.`,
      );
    }

    // Verificar si ya existe un registro con el mismo User y Membership (incluyendo eliminados lógicamente)
    const existingRecord = await this.userMembershipRepository.findOne({
      where: {
        user: { userId },
        membership: { membershipId },
      },
      withDeleted: true, // Incluir registros eliminados lógicamente
    });

    if (existingRecord) {
      if (existingRecord.deletedAt) {
        // Si existe pero está eliminado lógicamente, reactivarlo
        existingRecord.deletedAt = null; // Restaurar el estado
        console.log(
          `Reactivating logically deleted record with userId "${userId}" and membershipId "${membershipId}".`,
        );
        return await this.userMembershipRepository.save(existingRecord);
      }

      // Si no está eliminado, lanzar una excepción de conflicto
      throw new BadRequestException(
        `A record with userId "${userId}" and membershipId "${membershipId}" already exists.`,
      );
    }

    // Crear el nuevo registro si no existe
    const newUserMembership = this.userMembershipRepository.create({
      user,
      membership,
    });

    return await this.userMembershipRepository.save(newUserMembership);
  }

  // Obtener todas las relaciones de User y Membership
  async getAllUserMemberships(): Promise<UserMembership[]> {
    try {
      const userMemberships = await this.userMembershipRepository.find({
        relations: ['user', 'membership'], // Relacionar User y Membership
      });

      if (userMemberships.length === 0) {
        const logMessage = 'No UserMembership records found';
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return userMemberships;
    } catch (error) {
      this.handleServiceError(error); // Manejo de errores reutilizable
    }
  }

  async getUserMembershipsByUserId(userId: string): Promise<UserMembership[]> {
    const criteria = { user: { userId } as User }; // Cast explícito para evitar errores
    return this.getUserMembershipsByCriteria(
      criteria,
      `No UserMembership records found for user with ID ${userId}`,
    );
  }

  async getUserMembershipsByMembershipId(
    membershipId: number,
  ): Promise<UserMembership[]> {
    const criteria = { membership: { membershipId } as Membership }; // Cast explícito para evitar errores
    return this.getUserMembershipsByCriteria(
      criteria,
      `No UserMembership records found for membership with ID ${membershipId}`,
    );
  }

  async getUserMembershipById(
    userMembershipId: number,
  ): Promise<UserMembership> {
    const userMemberships = await this.getUserMembershipsByCriteria(
      { userMembershipId: userMembershipId },
      `UserMembership with ID ${userMembershipId} not found`,
    );

    // Dado que `find` devuelve un array, seleccionamos el primero (debería haber solo uno para el ID)
    return userMemberships[0];
  }

  // Eliminar una relación de User y Membership
  async deleteUserMembership(
    userMembershipId: number,
  ): Promise<{ message: string }> {
    try {
      const result =
        await this.userMembershipRepository.softDelete(userMembershipId);

      if (result.affected === 0) {
        const logMessage = `UserMembership with ID ${userMembershipId} not found`;
        console.warn(logMessage); // Registrar advertencia si no se encuentra el registro
        throw new NotFoundException(logMessage); // Lanzar excepción
      }

      return {
        message: `UserMembership with ID ${userMembershipId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }

  private async getUserMembershipsByCriteria(
    criteria: Partial<UserMembership>,
    errorMessage: string,
  ): Promise<UserMembership[]> {
    try {
      const userMemberships = await this.userMembershipRepository.find({
        where: criteria,
        relations: ['user', 'membership'],
      });

      if (userMemberships.length === 0) {
        console.warn(errorMessage); // Registrar advertencia si no se encuentran registros
        throw new NotFoundException(errorMessage); // Lanzar excepción
      }

      return userMemberships;
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }
}
