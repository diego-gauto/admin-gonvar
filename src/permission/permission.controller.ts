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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/createPermission.dto';
import { UpdatePermissionDto } from './dto/updatePermission.dto';
import { PermissionIdDto } from './dto/permissionId.dto';
import { Permission } from './entities/permission.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Get()
  async getAllPermissions(): Promise<Permission[]> {
    return await this.permissionService.getAllPermissions();
  }

  @Get(':permissionId')
  async getPermissionById(
    @Param() { permissionId }: PermissionIdDto,
  ): Promise<Permission> {
    return this.permissionService.getPermissionById(permissionId);
  }

  @Put(':permissionId')
  async updatePermission(
    @Param() { permissionId }: PermissionIdDto,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    return this.permissionService.updatePermission(
      permissionId,
      updatePermissionDto,
    );
  }

  @Delete(':permissionId')
  @HttpCode(HttpStatus.OK)
  async deletePermission(
    @Param() { permissionId }: PermissionIdDto,
  ): Promise<{ message: string }> {
    return this.permissionService.deletePermission(permissionId);
  }
}
