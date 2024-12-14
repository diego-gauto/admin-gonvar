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
import { RolePermissionService } from './rolePermission.service';
import { CreateRolePermissionDto } from './dto/createRolePermission.dto';
import { RolePermissionIdDto } from './dto/rolePermissionId.dto';
import { RolePermission } from './entities/rolePermission.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleIdDto } from './dto/roleId.dto';

@ApiTags('RolePermission')
@ApiBearerAuth()
@Controller('rolePermission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  // Crear una nueva relación de Role y Permission
  @Post()
  async createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    return this.rolePermissionService.createRolePermission(
      createRolePermissionDto,
    );
  }

  // Obtener todas las relaciones de Role y Permission
  @Get()
  async getAllRolePermissions(): Promise<RolePermission[]> {
    return this.rolePermissionService.getAllRolePermissions();
  }

  // Obtener una relación específica por su ID
  @Get(':rolePermissionId')
  async getRolePermissionById(
    @Param() { rolePermissionId }: RolePermissionIdDto,
  ): Promise<RolePermission> {
    return this.rolePermissionService.getRolePermissionById(rolePermissionId);
  }

  // Obtener todas las relaciones de Role y Permission para un Role específico
  @Get('role/:roleId')
  async getRolePermissionsByRoleId(
    @Param() { roleId }: RoleIdDto,
  ): Promise<RolePermission[]> {
    return this.rolePermissionService.getRolePermissionsByRoleId(roleId);
  }

  // Actualizar una relación de Role y Permission
  // @Put(':rolePermissionId')
  // async updateRolePermission(
  //   @Param() { rolePermissionId }: RolePermissionIdDto,
  //   @Body() updateRolePermissionDto: UpdateRolePermissionDto,
  // ): Promise<RolePermission> {
  //   return this.rolePermissionService.updateRolePermission(
  //     rolePermissionId,
  //     updateRolePermissionDto,
  //   );
  // }

  // Eliminar una relación de Role y Permission
  @Delete(':rolePermissionId')
  @HttpCode(HttpStatus.OK)
  async deleteRolePermission(
    @Param() { rolePermissionId }: RolePermissionIdDto,
  ): Promise<{ message: string }> {
    return this.rolePermissionService.deleteRolePermission(rolePermissionId);
  }
}
