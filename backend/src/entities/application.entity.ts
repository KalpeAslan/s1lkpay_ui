import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DomesticTransfer } from './domestic-transfer.entity';
import { GlobalTransfer } from './global-transfer.entity';
import { FxConvert } from './fx-convert.entity';
import { PaymentOrder } from './payment-order.entity';
import { User } from './user.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OperationType {
  DOMESTIC_TRANSFER = 'DOMESTIC_TRANSFER',
  GLOBAL_TRANSFER = 'GLOBAL_TRANSFER',
  FX_CONVERT = 'FX_CONVERT',
  PAYMENT_ORDER = 'PAYMENT_ORDER',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  number: string;

  @Column({
    type: 'enum',
    enum: OperationType,
  })
  type: OperationType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  amount: number;

  @Column({ nullable: true })
  currency: string;

  @ManyToOne(() => User, (user) => user.applications, {
    nullable: false,
  })
  user: User;

  @OneToOne(() => DomesticTransfer, (transfer) => transfer.application, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  domesticTransfer: DomesticTransfer;

  @OneToOne(() => GlobalTransfer, (transfer) => transfer.application, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  globalTransfer: GlobalTransfer;

  @OneToOne(() => FxConvert, (convert) => convert.application, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  fxConvert: FxConvert;

  @OneToOne(() => PaymentOrder, (order) => order.application, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  paymentOrder: PaymentOrder;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

