import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';

@Entity('branches')
// Índices únicos separados para garantizar que name y location no se repitan en la misma Company
@Index(['company', 'name'], { unique: true })
@Index(['company', 'location'], { unique: true })
export class Branch {
  @PrimaryGeneratedColumn({ name: 'branch_id' })
  branchId: number;

  @ManyToOne(() => Company, (company) => company.branches)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  phoneNumber: string;

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
  updateAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;
}
