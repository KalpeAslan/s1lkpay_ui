import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

export enum PaymentLinkStatus {
  PENDING = 'pending',
  PAID = 'paid',
  EXPIRED = 'expired',
}

export enum CryptoToken {
  USDC = 'USDC',
  USDT = 'USDT',
  SOL = 'SOL',
  KZTE = 'KZTE',
  PEPE = 'PEPE',
}

@Entity('payment_links')
export class PaymentLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  customerName: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: CryptoToken })
  token: CryptoToken;

  @Column('decimal', { precision: 20, scale: 6 })
  cryptoAmount: number;

  @Column({ default: false })
  acceptAnyToken: boolean;

  @Column({ default: 'Solana · Mainnet' })
  network: string;

  @Column({ type: 'enum', enum: PaymentLinkStatus, default: PaymentLinkStatus.PENDING })
  status: PaymentLinkStatus;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date | null;

  @Column({ nullable: true })
  txHash: string;

  @Column({ nullable: true })
  paidWithToken: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true, type: 'text' })
  customerNote: string;

  @Column({ nullable: true })
  walletAddress: string;

  @ManyToOne(() => User, (user) => user.paymentLinks, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
