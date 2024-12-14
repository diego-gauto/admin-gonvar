import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserCompanyRoleService } from './userCompanyRole.service';
import { CreateUserCompanyRoleDto } from './dto/createUserCompanyRole.dto';
import { UpdateUserCompanyRoleDto } from './dto/updateUserCompanyRole.dto';
import { UserCompanyRoleIdDto } from './dto/userCompanyRoleId.dto';
import { UserCompanyRole } from './entities/userCompanyRole.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryRunner } from 'typeorm';
import { CompanyIdDto } from './dto/companyId.dto';

@ApiTags('UserCompanyRole')
@ApiBearerAuth()
@Controller('userCompanyRole')
export class UserCompanyRoleController {
  constructor(
    private readonly userCompanyRoleService: UserCompanyRoleService,
  ) {}

  @Post()
  async createUserCompanyRoleTransaction(
    @Body() createUserCompanyRoleDto: CreateUserCompanyRoleDto,
    queryRunner: QueryRunner,
  ): Promise<UserCompanyRole> {
    return this.userCompanyRoleService.createUserCompanyRoleTransaction(
      createUserCompanyRoleDto,
      queryRunner,
    );
  }

  @Get()
  async getAllUsersCompanyRole(): Promise<UserCompanyRole[]> {
    return this.userCompanyRoleService.getAllUsersCompanyRole();
  }

  @Get(':userCompanyRoleId')
  async getUserCompanyRoleById(
    @Param() { userCompanyRoleId }: UserCompanyRoleIdDto,
  ): Promise<UserCompanyRole> {
    return this.userCompanyRoleService.getUserCompanyRoleById(
      userCompanyRoleId,
    );
  }

  @Get('company/:companyId')
  async getUserCompanyRoleByCompanyId(
    @Param() { companyId }: CompanyIdDto,
  ): Promise<UserCompanyRole[]> {
    return this.userCompanyRoleService.getAllUsersCompanyRoleByCompanyId(
      companyId,
    );
  }

  @Put(':userCompanyRoleId')
  async updateUserCompanyRole(
    @Param() { userCompanyRoleId }: UserCompanyRoleIdDto,
    @Body() updateUserCompanyRoleDto: UpdateUserCompanyRoleDto,
  ): Promise<UserCompanyRole> {
    return this.userCompanyRoleService.updateUserCompanyRole(
      userCompanyRoleId,
      updateUserCompanyRoleDto,
    );
  }

  @Delete(':userCompanyRoleId')
  @HttpCode(HttpStatus.OK)
  async deleteUserCompanyRole(
    @Param() { userCompanyRoleId }: UserCompanyRoleIdDto,
  ): Promise<{
    message: string;
  }> {
    return this.userCompanyRoleService.deleteUserCompanyRole(userCompanyRoleId);
  }
}
