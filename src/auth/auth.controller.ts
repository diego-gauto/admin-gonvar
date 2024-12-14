import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { userRegisterDTO, userLoginDTO } from './dto/auth.dto';
import { PublicAcces } from './decorator/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAcces()
  //TODO: add swagger http response
  // @ApiOperation({ summary: 'Create cat' })
  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('userRegister')
  register(@Body() userRegisterDTO: userRegisterDTO) {
    return this.authService.userRegister(userRegisterDTO);
  }

  @PublicAcces()
  @Post('userLogin')
  login(@Body() userLoginDTO: userLoginDTO) {
    return this.authService.userLogin(userLoginDTO);
  }
}
