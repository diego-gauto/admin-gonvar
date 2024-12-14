import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Service } from 'src/service/entities/service.entity';
import { Company } from 'src/company/entities/company.entity';

@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn({ name: 'service_category_id' })
  serviceCategoryId: number;

  @Column({ type: 'varchar', length: 50 }) // Nombre limitado a 50 caracteres
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) // Descripción limitada a 100 caracteres, opcional
  description: string;

  @OneToMany(() => Service, (service) => service.serviceCategory)
  services: Service[];

  @ManyToOne(() => Company, (company) => company.serviceCategories)
  @JoinColumn({ name: 'company_id' }) // Define la columna de unión
  company: Company;

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
