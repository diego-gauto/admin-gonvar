import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Membership } from 'src/membership/entities/membership.entity';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn({ name: 'user_membership_id' })
  userMembershipId: number;

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

  @ManyToOne(() => User, (user) => user.userMemberships, { eager: true })
  @JoinColumn({ name: 'user_id' }) // Define la relación con la entidad User
  user: User;

  @ManyToOne(() => Membership, (membership) => membership.userMemberships, {
    eager: true,
  })
  @JoinColumn({ name: 'membership_id' }) // Define la relación con la entidad Membership
  membership: Membership;
}
