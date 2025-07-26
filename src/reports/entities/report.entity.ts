import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('reports')
export class Report extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  make: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'integer' })
  @Index()
  year: number;

  @Column({ type: 'integer' })
  mileage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'real', nullable: true })
  longitude: number;

  @Column({ type: 'real', nullable: true })
  latitude: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'boolean', default: false })
  isApproved: boolean;

  @ManyToOne(() => User, (user) => user.reports, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  @Index()
  userId: string;

  // Virtual property for car identification
  get carIdentifier(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }

  // Virtual property for location display
  get location(): string {
    if (this.latitude && this.longitude) {
      return `${this.latitude}, ${this.longitude}`;
    }
    return 'Location not provided';
  }
}
