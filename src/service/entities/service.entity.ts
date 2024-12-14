import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceCategory } from 'src/serviceCategory/entities/serviceCategory.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn({ name: 'service_id' })
  serviceId: number;

  @ManyToOne(
    () => ServiceCategory,
    (serviceCategory) => serviceCategory.services,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'service_category_id' })
  serviceCategory: ServiceCategory;

  @Column({ type: 'varchar', length: 50 }) // Nombre limitado a 50 caracteres
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true }) // Descripción limitada a 100 caracteres, opcional
  description: string;

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
