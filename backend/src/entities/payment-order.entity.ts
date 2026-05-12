import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('payment_orders')
export class PaymentOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  knp: string;

  @Column()
  kvo: string;

  @Column({ nullable: true, type: 'text' })
  message: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @OneToOne(() => Application, (application) => application.paymentOrder, {
    nullable: true,
  })
  application: Application;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

