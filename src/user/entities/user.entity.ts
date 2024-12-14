import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { UserCompanyRole } from 'src/userCompanyRole/entities/userCompanyRole.entity';
import { UserMembership } from 'src/userMembership/entities/userMembership.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ name: 'external_user_id' })
  externalUserId: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  phonenumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

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

  @OneToMany(() => UserCompanyRole, (userCompanyRole) => userCompanyRole.user)
  userCompanyRole: UserCompanyRole[];

  @OneToMany(() => UserMembership, (userMembership) => userMembership.user)
  userMemberships: UserMembership[];
}
