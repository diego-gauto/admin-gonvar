import { forwardRef, Module } from '@nestjs/common';
import { UserCompanyRoleService } from './userCompanyRole.service';
import { UserCompanyRoleController } from './userCompanyRole.controller';
import { UserCompanyRole } from './entities/userCompanyRole.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserCompanyRole]),
    forwardRef(() => CompanyModule),
    UserModule,
    RoleModule,
  ],
  controllers: [UserCompanyRoleController],
  providers: [UserCompanyRoleService],
  exports: [UserCompanyRoleService],
})
export class UserCompanyRoleModule {}
