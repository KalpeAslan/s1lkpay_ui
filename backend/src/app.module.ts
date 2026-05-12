import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './entities/user.entity';
import { DomesticTransfer } from './entities/domestic-transfer.entity';
import { GlobalTransfer } from './entities/global-transfer.entity';
import { FxConvert } from './entities/fx-convert.entity';
import { PaymentOrder } from './entities/payment-order.entity';
import { Application } from './entities/application.entity';
import { PaymentLink } from './entities/payment-link.entity';
import { Wallet } from './entities/wallet.entity';

// Modules
import { AuthModule } from './auth/auth.module';

// Services
import { DomesticTransferService } from './services/domestic-transfer.service';
import { GlobalTransferService } from './services/global-transfer.service';
import { FxConvertService } from './services/fx-convert.service';
import { PaymentOrderService } from './services/payment-order.service';
import { ApplicationService } from './services/application.service';
import { PaymentLinkService } from './services/payment-link.service';
import { DashboardService } from './services/dashboard.service';
import { PaymentsAnalyticsService } from './services/payments-analytics.service';
import { SettingsService } from './services/settings.service';
import { WalletService } from './services/wallet.service';
import { SolanaService } from './services/solana.service';
import { HeliusWebhookService } from './services/helius-webhook.service';
import { ConversionService } from './services/conversion.service';

// Controllers
import { DomesticTransferController } from './controllers/domestic-transfer.controller';
import { GlobalTransferController } from './controllers/global-transfer.controller';
import { FxConvertController } from './controllers/fx-convert.controller';
import { PaymentOrderController } from './controllers/payment-order.controller';
import { ApplicationController } from './controllers/application.controller';
import { PaymentLinkController } from './controllers/payment-link.controller';
import { PublicPayController } from './controllers/public-pay.controller';
import { DashboardController } from './controllers/dashboard.controller';
import { PaymentsAnalyticsController } from './controllers/payments-analytics.controller';
import { SettingsController } from './controllers/settings.controller';
import { WalletController } from './controllers/wallet.controller';
import { WebhookController } from './controllers/webhook.controller';
import { TokensController } from './controllers/tokens.controller';

// @ts-ignore
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'fintech',
      entities: [
        User,
        DomesticTransfer,
        GlobalTransfer,
        FxConvert,
        PaymentOrder,
        Application,
        PaymentLink,
        Wallet,
      ],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([
      User,
      DomesticTransfer,
      GlobalTransfer,
      FxConvert,
      PaymentOrder,
      Application,
      PaymentLink,
      Wallet,
    ]),
    AuthModule,
  ],
  controllers: [
    AppController,
    DomesticTransferController,
    GlobalTransferController,
    FxConvertController,
    PaymentOrderController,
    ApplicationController,
    PaymentLinkController,
    PublicPayController,
    DashboardController,
    PaymentsAnalyticsController,
    SettingsController,
    WalletController,
    WebhookController,
    TokensController,
  ],
  providers: [
    AppService,
    DomesticTransferService,
    GlobalTransferService,
    FxConvertService,
    PaymentOrderService,
    ApplicationService,
    PaymentLinkService,
    DashboardService,
    PaymentsAnalyticsService,
    SettingsService,
    WalletService,
    SolanaService,
    HeliusWebhookService,
    ConversionService,
  ],
})
export class AppModule {}
