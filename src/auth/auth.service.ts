import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  userAuthResponse,
  userLoginDTO,
  userRegisterDTO,
} from './dto/auth.dto';
import { AuthToken } from './dto/IAuth.types';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async userRegister(
    userRegisterDTO: userRegisterDTO,
  ): Promise<userAuthResponse> {
    const user: User = await this.userService.createUser(userRegisterDTO);
    const registerResponse = { token: this.generateuserToken(user), user };
    return registerResponse;
  }

  async userLogin(userLoginDTO: userLoginDTO): Promise<userAuthResponse> {
    const { email, password } = userLoginDTO;
    try {
      const existinguser: User = await this.userService.getuserByEmail(email);

      if (!existinguser) {
        console.warn(
          `user doesn't exists with this email: ${existinguser.email}`,
        );
        throw new ConflictException('An user with this email does not exists');
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        existinguser.password,
      );
      if (!isPasswordValid) {
        console.warn(`invalid password to user with email:${email} `);
        throw new UnauthorizedException('Invalid credentials');
      }
      const loginResponse = {
        token: this.generateuserToken(existinguser),
        user: existinguser,
      };
      return loginResponse;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error; // Deja que ConflictException se propague directamente.
      }

      let exception: Error;
      let logMessage: string;

      if (error.name === 'QueryFailedError') {
        exception = new ServiceUnavailableException(
          'Database connection failed',
        );
        logMessage = 'Database connection failed';
      } else {
        exception = new InternalServerErrorException(
          'An unexpected error occurred',
        );
        logMessage = 'An unexpected error occurred';
      }
      console.error(logMessage);
      throw exception;
    }
  }

  private generateuserToken(user: User): AuthToken {
    const payload = { role: 'user', sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
