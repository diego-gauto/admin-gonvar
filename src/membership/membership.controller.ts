import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import { CreateMembershipDto } from './dto/createMembership.dto';
import { UpdateMembershipDto } from './dto/updateMembership.dto';
import { MembershipIdDto } from './dto/membershipId.dto';
import { Membership } from './entities/membership.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Membership')
@ApiBearerAuth()
@Controller('memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post()
  async createMembership(
    @Body() createMembershipDto: CreateMembershipDto,
  ): Promise<Membership> {
    return this.membershipService.createMembership(createMembershipDto);
  }

  @Get()
  async getAllMemberships(): Promise<Membership[]> {
    return this.membershipService.getAllMemberships();
  }

  @Get(':membershipId')
  async getMembershipById(
    @Param() { membershipId }: MembershipIdDto,
  ): Promise<Membership> {
    return this.membershipService.getMembershipById(membershipId);
  }

  @Put(':membershipId')
  async updateMembership(
    @Param() { membershipId }: MembershipIdDto,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ): Promise<Membership> {
    return this.membershipService.updateMembership(
      membershipId,
      updateMembershipDto,
    );
  }

  @Delete(':membershipId')
  async deleteMembership(
    @Param() { membershipId }: MembershipIdDto,
  ): Promise<{ message: string }> {
    return this.membershipService.deleteMembership(membershipId);
  }
}
