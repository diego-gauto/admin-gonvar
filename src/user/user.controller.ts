import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { Auth } from 'src/auth/decorator/auth.guard.decorator';
import { UserIdDto } from './dto/userId.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createuser(@Body() createuserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createuserDto);
  }

  @Get()
  @Auth()
  async getAllusers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':userId')
  @Auth()
  async getuser(@Param() { userId }: UserIdDto): Promise<User> {
    return this.userService.getUserById(userId);
  }

  @Put(':userId')
  @Auth()
  async updateuser(
    @Param() { userId }: UserIdDto, // Ahora, pasas el DTO directamente
    @Body() updateuserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(userId, updateuserDto);
  }

  @Delete(':userId')
  @Auth()
  @HttpCode(HttpStatus.OK)
  async deleteuser(
    @Param() { userId }: UserIdDto,
  ): Promise<{ message: string }> {
    return this.userService.deleteUser(userId);
  }
}
