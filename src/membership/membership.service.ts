import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from './entities/membership.entity';
import { CreateMembershipDto } from './dto/createMembership.dto';
import { UpdateMembershipDto } from './dto/updateMembership.dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class MembershipService extends BaseService {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {
    super();
  }

  // Método para crear una nueva membresía
  async createMembership(
    createMembershipDto: CreateMembershipDto,
  ): Promise<Membership> {
    const { name } = createMembershipDto;

    // Buscar un registro existente con el mismo nombre, incluidos los eliminados
    const membership = await this.membershipRepository.findOne({
      where: { name },
      withDeleted: true,
    });

    if (membership?.deletedAt) {
      // Reactivar el registro eliminado actualizándolo con los nuevos datos
      Object.assign(membership, createMembershipDto, { deletedAt: null });
      return this.membershipRepository.save(membership);
    }

    if (membership) {
      // Si el registro ya existe y está activo, lanzar una excepción
      throw new BadRequestException(
        `A membership with the name "${name}" already exists.`,
      );
    }

    // Crear y guardar una nueva membresía si no existe ningún registro previo
    return this.membershipRepository.save(
      this.membershipRepository.create(createMembershipDto),
    );
  }

  // Método para obtener todas las membresías
  async getAllMemberships(): Promise<Membership[]> {
    try {
      const memberships = await this.membershipRepository.find();

      if (memberships.length === 0) {
        const logMessage = 'No memberships found';
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return memberships;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para obtener una membresía por ID
  async getMembershipById(membershipId: number): Promise<Membership> {
    try {
      const existingMembership = await this.membershipRepository.findOne({
        where: { membershipId },
      });

      if (!existingMembership) {
        const logMessage = `Membership with ID ${membershipId} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return existingMembership;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para actualizar una membresía
  async updateMembership(
    membershipId: number,
    updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    const existingMembership = await this.membershipRepository.findOne({
      where: { membershipId },
    });

    if (!existingMembership) {
      const logMessage = `Membership with ID ${membershipId} not found`;
      console.warn(logMessage);
      throw new NotFoundException(logMessage);
    }

    // Actualiza las propiedades de la membresía existente con los nuevos datos
    Object.assign(existingMembership, updateMembershipDto);

    try {
      return await this.membershipRepository.save(existingMembership);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  // Método para eliminar una membresía (lógicamente)
  async deleteMembership(membershipId: number): Promise<{ message: string }> {
    try {
      const result = await this.membershipRepository.softDelete(membershipId);

      if (result.affected === 0) {
        const logMessage = `Membership with ID ${membershipId} not found`;
        console.warn(logMessage);
        throw new NotFoundException(logMessage);
      }

      return {
        message: `Membership with ID ${membershipId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error);
    }
  }
}
