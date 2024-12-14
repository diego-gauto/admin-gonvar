import { Module } from '@nestjs/common';
import { UserMembershipService } from './userMembership.service';
import { UserMembershipController } from './userMembership.controller';
import { UserMembership } from './entities/userMembership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { MembershipModule } from 'src/membership/membership.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMembership]),
    UserModule,
    MembershipModule,
  ],
  controllers: [UserMembershipController],
  providers: [UserMembershipService],
  exports: [UserMembershipService],
})
export class UserMembershipModule {}
