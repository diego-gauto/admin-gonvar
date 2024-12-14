import {
  Injectable,
  NotFoundException,
  ConflictException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { BaseService } from 'src/common/services/base.service';

@Injectable()
export class UserService extends BaseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async createUser(createuserDto: CreateUserDto): Promise<User> {
    try {
      const existinguser = await this.userRepository.findOne({
        where: { email: createuserDto.email },
      });

      if (existinguser) {
        console.warn(
          `user already exists with this email: ${createuserDto.email}`,
        );
        throw new ConflictException('An user with this email already exists');
      }

      const hashPassword = await hash(createuserDto.password, 10);
      const newuser = this.userRepository.create({
        ...createuserDto,
        password: hashPassword,
      });

      return await this.userRepository.save(newuser);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find();

      if (users.length === 0) {
        const logMessage = 'No users found';
        console.warn(logMessage); // Usar warn para registrar que no se encontraron propietarios.
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente.
      }

      return users;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      console.log('dentro del getUserById');
      const existinguser = await this.userRepository.findOne({
        where: { userId: userId },
      });
      console.log(existinguser);

      if (!existinguser) {
        const logMessage = `user with ID ${userId} not found`;
        console.warn(logMessage); // Usar warn para registrar que no se encontró el propietario.
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente.
      }
      return existinguser;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async getuserByEmail(email: string): Promise<User> {
    try {
      const existinguser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (!existinguser) {
        const logMessage = `user with email ${email} not found`;
        console.warn(logMessage); // Usar warn para registrar que no se encontró el propietario.
        throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente.
      }
      return existinguser;
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async updateUser(
    userId: string,
    updateuserDto: UpdateUserDto,
  ): Promise<User> {
    // Busca el user existente
    const existinguser = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!existinguser) {
      const logMessage = `user with ID ${userId} not found`;
      console.warn(logMessage); // Usar warn para registrar que no se encontró el propietario.
      throw new NotFoundException(logMessage); // Lanzar la excepción correspondiente.
    }

    // Si el DTO contiene el campo password, aplicamos el hashing
    if (updateuserDto.password) {
      try {
        const hashedPassword = await hash(updateuserDto.password, 10);
        updateuserDto.password = hashedPassword;
      } catch (error) {
        console.error('Error hashing password');
        throw new InternalServerErrorException('Error processing password');
      }
    }

    // Actualiza las propiedades del user existente con los nuevos datos
    Object.assign(existinguser, updateuserDto);

    try {
      // Guarda los cambios en la base de datos
      return await this.userRepository.save(existinguser);
    } catch (error) {
      this.handleServiceError(error);
    }
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    try {
      const result = await this.userRepository.softDelete({ userId });

      if (result.affected === 0) {
        const logMessage = `User with ID ${userId} not found`;
        console.warn(logMessage); // Registrar advertencia si no se encuentra el registro
        throw new NotFoundException(logMessage); // Lanzar excepción
      }

      return {
        message: `User with ID ${userId} deleted successfully (logically)`,
      };
    } catch (error) {
      this.handleServiceError(error); // Manejo centralizado de errores
    }
  }
}
