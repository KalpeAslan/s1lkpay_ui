import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Application } from './application.entity';
import { PaymentLink } from './payment-link.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  supportEmail: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  walletAddress: string;

  @Column('simple-array', { nullable: true, default: 'USDC,USDT,SOL' })
  acceptedTokens: string[];

  @Column({ nullable: true, default: 'Solana · Mainnet' })
  network: string;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => PaymentLink, (link) => link.user)
  paymentLinks: PaymentLink[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

