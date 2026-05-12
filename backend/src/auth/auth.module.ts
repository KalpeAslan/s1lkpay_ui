import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Wallet } from '../entities/wallet.entity';
import { PaymentLink } from '../entities/payment-link.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { WalletService } from '../services/wallet.service';
import { SolanaService } from '../services/solana.service';
import { HeliusWebhookService } from '../services/helius-webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, PaymentLink]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WalletService, SolanaService, HeliusWebhookService],
  exports: [AuthService],
})
export class AuthModule {}
