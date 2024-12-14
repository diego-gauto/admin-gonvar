import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

export function Auth() {
  return UseGuards(JwtAuthGuard);
}
