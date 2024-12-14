import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Role } from '../../role/entities/role.entity';
import { Company } from '../../company/entities/company.entity';

@Entity('users_roles_companies') // Nombre de la tabla en plural
export class UserCompanyRole {
  @PrimaryGeneratedColumn({ name: 'user_company_role_id' }) // Nombre de la columna en la base de datos
  userCompanyRoleId: number;

  @ManyToOne(() => User, (user) => user.userCompanyRole, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userCompanyRole, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @ManyToOne(() => Company, (company) => company.userRoleCompanies, {
    nullable: true,
  })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
