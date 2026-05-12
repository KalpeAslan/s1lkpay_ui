import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('global_transfers')
export class GlobalTransfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  accountFrom: string;

  @Column()
  receiverAddress: string;

  @Column()
  receiverCountry: string;

  @Column({ nullable: true })
  receiverCountryCode: string;

  @OneToOne(() => Application, (application) => application.globalTransfer, {
    nullable: true,
  })
  application: Application;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

