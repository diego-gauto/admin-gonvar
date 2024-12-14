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
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { RoleIdDto } from './dto/roleId.dto';
import { Role } from './entities/role.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    console.log('inicia el create role controler');
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return await this.roleService.getAllRoles();
  }

  @Get(':roleId')
  async getRoleById(@Param() { roleId }: RoleIdDto): Promise<Role> {
    return this.roleService.getRoleById(roleId);
  }

  @Put(':roleId')
  async updateRole(
    @Param() { roleId }: RoleIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    return this.roleService.updateRole(roleId, updateRoleDto);
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.OK)
  async deleteRole(
    @Param() { roleId }: RoleIdDto,
  ): Promise<{ message: string }> {
    return this.roleService.deleteRole(roleId);
  }
}
