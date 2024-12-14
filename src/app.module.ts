import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from './config/environment';
import { typeOrmConfig } from './config/typeorm';
import { UserModule } from './user/user.module';
import { LoggerService } from './logger/logger.service';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { BranchModule } from './branch/branch.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { UserCompanyRoleModule } from './userCompanyRole/userCompanyRole.module';
import { RolePermissionModule } from './rolePermission/rolePermission.module';
import { MembershipModule } from './membership/membership.module';
import { UserMembershipModule } from './userMembership/userMembership.module';
import { ServiceModule } from './service/service.module';
import { ServiceCategoryModule } from './serviceCategory/serviceCategory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [environment],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,
    }),
    UserModule,
    AuthModule,
    CompanyModule,
    BranchModule,
    RoleModule,
    PermissionModule,
    UserCompanyRoleModule,
    RolePermissionModule,
    MembershipModule,
    UserMembershipModule,
    ServiceModule,
    ServiceCategoryModule,
  ],
  providers: [
    LoggerService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
