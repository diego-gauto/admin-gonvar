import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserMembershipService } from './userMembership.service';
import { CreateUserMembershipDto } from './dto/createUserMembership.dto';
import { UserMembershipIdDto } from './dto/userMembershipId.dto';
import { UserIdDto } from './dto/userId.dto';
import { MembershipIdDto } from './dto/membershipId.dto';
import { UserMembership } from './entities/userMembership.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('UserMembership')
@ApiBearerAuth()
@Controller('userMembership')
export class UserMembershipController {
  constructor(private readonly userMembershipService: UserMembershipService) {}

  // Crear una nueva relación de User y Membership
  @Post()
  async createUserMembership(
    @Body() createUserMembershipDto: CreateUserMembershipDto,
  ): Promise<UserMembership> {
    return this.userMembershipService.createUserMembership(
      createUserMembershipDto,
    );
  }

  // Obtener todas las relaciones de User y Membership
  @Get()
  async getAllUserMemberships(): Promise<UserMembership[]> {
    return this.userMembershipService.getAllUserMemberships();
  }

  // Obtener una relación específica por su ID
  @Get(':userMembershipId')
  async getUserMembershipById(
    @Param() { userMembershipId }: UserMembershipIdDto,
  ): Promise<UserMembership> {
    return this.userMembershipService.getUserMembershipById(userMembershipId);
  }

  // Obtener todas las relaciones de User y Membership para un User específico
  @Get('user/:userId')
  async getUserMembershipsByUserId(
    @Param() { userId }: UserIdDto,
  ): Promise<UserMembership[]> {
    return this.userMembershipService.getUserMembershipsByUserId(userId);
  }

  // Obtener todas las relaciones de User y Membership para una Membership específica
  @Get('membership/:membershipId')
  async getUserMembershipsByMembershipId(
    @Param() { membershipId }: MembershipIdDto,
  ): Promise<UserMembership[]> {
    return this.userMembershipService.getUserMembershipsByMembershipId(
      membershipId,
    );
  }

  // Eliminar una relación de User y Membership
  @Delete(':userMembershipId')
  @HttpCode(HttpStatus.OK)
  async deleteUserMembership(
    @Param() { userMembershipId }: UserMembershipIdDto,
  ): Promise<{ message: string }> {
    return this.userMembershipService.deleteUserMembership(userMembershipId);
  }
}
