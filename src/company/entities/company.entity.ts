import { Branch } from 'src/branch/entities/branch.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { ServiceCategory } from 'src/serviceCategory/entities/serviceCategory.entity';
import { UserCompanyRole } from 'src/userCompanyRole/entities/userCompanyRole.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn({ name: 'company_id' })
  companyId: number;

  @Column()
  name: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

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
  deletedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];

  @OneToMany(() => UserCompanyRole, (userCompanyRole) => userCompanyRole.role)
  userRoleCompanies: UserCompanyRole[];

  @OneToMany(() => Membership, (membership) => membership.company)
  memberships: Membership[];

  @OneToMany(
    () => ServiceCategory,
    (serviceCategory) => serviceCategory.company,
  )
  serviceCategories: ServiceCategory[];

  async applySoftDeleteCascade(deletedAt: Date): Promise<void> {
    this.deletedAt = deletedAt;
    for (const membership of this.memberships || []) {
      membership.deletedAt = deletedAt;
    }
  }
}
