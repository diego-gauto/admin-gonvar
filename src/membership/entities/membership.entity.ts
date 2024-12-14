import { Company } from 'src/company/entities/company.entity';
import { UserMembership } from 'src/userMembership/entities/userMembership.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn({ name: 'membership_id' })
  membershipId: number;

  @Column()
  name: string;

  @Column({ type: 'int' }) // Duración en días, meses o años según tu lógica
  duration: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Precio con dos decimales
  price: number;

  @ManyToOne(() => Company, (company) => company.memberships, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(
    () => UserMembership,
    (userMembership) => userMembership.membership,
  )
  userMemberships: UserMembership[];

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
}
