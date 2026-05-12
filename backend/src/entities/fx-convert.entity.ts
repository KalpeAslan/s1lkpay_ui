import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Application } from './application.entity';

@Entity('fx_converts')
export class FxConvert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 15, scale: 2 })
  buyAmount: number;

  @Column()
  buyCurrency: string;

  @Column('decimal', { precision: 15, scale: 2 })
  sellAmount: number;

  @Column()
  sellCurrency: string;

  @Column('decimal', { precision: 10, scale: 6 })
  exchangeRate: number;

  @OneToOne(() => Application, (application) => application.fxConvert, {
    nullable: true,
  })
  application: Application;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

