import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('domestic_transfers')
export class DomesticTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  recipientType: string;

  @Column()
  recipientId: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  accountNumber: string;

  @Column({ nullable: true })
  bic: string;

  @Column({ nullable: true })
  kbe: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  paymentPurpose: string;

  @Column({ nullable: true })
  paymentDetails: string;

  @Column({ nullable: true })
  currentStep: number;

  @OneToOne(() => Application, (application) => application.domesticTransfer, {
    nullable: true,
  })
  application: Application;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
