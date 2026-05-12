import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { PaymentLink, PaymentLinkStatus } from '../entities/payment-link.entity';
import { TOKEN_BY_MINT } from '../config/tokens.config';

@Injectable()
export class HeliusWebhookService implements OnApplicationBootstrap {
  private readonly logger = new Logger(HeliusWebhookService.name);
  private readonly apiKey = process.env.HELIUS_API_KEY;
  private readonly baseUrl = 'https://api.helius.xyz/v0';
  private webhookId: string | null = null;

  constructor(
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    @InjectRepository(PaymentLink)
    private paymentLinkRepo: Repository<PaymentLink>,
  ) {}

  async onApplicationBootstrap() {
    if (!this.apiKey || !process.env.WEBHOOK_BASE_URL) {
      this.logger.warn('HELIUS_API_KEY or WEBHOOK_BASE_URL not set — skipping webhook registration');
      return;
    }
    await this.registerOrUpdateWebhook();
  }

  private async registerOrUpdateWebhook() {
    try {
      const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/webhooks/helius`;
      const allWallets = await this.walletRepo.find();
      const addresses = allWallets.map(w => w.publicKey);

      const existing = await this.getExistingWebhook(webhookUrl);

      if (existing) {
        this.webhookId = existing.webhookID;
        await this.updateWebhook(existing.webhookID, webhookUrl, addresses);
        this.logger.log(`Updated Helius webhook ${existing.webhookID} with ${addresses.length} addresses`);
      } else {
        const created = await this.createWebhook(webhookUrl, addresses);
        this.webhookId = created.webhookID;
        this.logger.log(`Created Helius webhook ${created.webhookID}`);
      }
    } catch (err) {
      this.logger.error('Failed to register Helius webhook: ' + err.message);
    }
  }

  async addAddressToWebhook(address: string) {
    if (!this.webhookId || !process.env.WEBHOOK_BASE_URL) return;
    try {
      const webhookUrl = `${process.env.WEBHOOK_BASE_URL}/webhooks/helius`;
      const allWallets = await this.walletRepo.find();
      const addresses = allWallets.map(w => w.publicKey);
      if (!addresses.includes(address)) addresses.push(address);
      await this.updateWebhook(this.webhookId, webhookUrl, addresses);
    } catch (err) {
      this.logger.error('Failed to add address to webhook: ' + err.message);
    }
  }

  async handlePayment(events: any[]) {
    for (const event of events) {
      try {
        await this.processEvent(event);
      } catch (err) {
        this.logger.error('Error processing webhook event: ' + err.message);
      }
    }
  }

  private async processEvent(event: any) {
    const txHash = event.signature;
    const transfers = event.tokenTransfers || [];
    const nativeTransfers = event.nativeTransfers || [];

    for (const transfer of transfers) {
      const { toUserAccount, mint, tokenAmount } = transfer;
      if (!toUserAccount || !mint || !tokenAmount) continue;

      const wallet = await this.walletRepo.findOne({ where: { publicKey: toUserAccount } });
      if (!wallet) continue;

      const tokenConfig = TOKEN_BY_MINT[mint];
      const pendingLink = await this.paymentLinkRepo.findOne({
        where: { user: { id: wallet.userId }, status: PaymentLinkStatus.PENDING },
        order: { createdAt: 'DESC' },
      });

      if (pendingLink) {
        pendingLink.status = PaymentLinkStatus.PAID;
        pendingLink.txHash = txHash;
        pendingLink.paidAt = new Date();
        await this.paymentLinkRepo.save(pendingLink);
        this.logger.log(`Payment link ${pendingLink.slug} marked as PAID via webhook`);
      }
    }

    for (const transfer of nativeTransfers) {
      const { toUserAccount, amount } = transfer;
      if (!toUserAccount || !amount) continue;

      const wallet = await this.walletRepo.findOne({ where: { publicKey: toUserAccount } });
      if (!wallet) continue;

      const pendingLink = await this.paymentLinkRepo.findOne({
        where: { user: { id: wallet.userId }, status: PaymentLinkStatus.PENDING, token: 'SOL' as any },
        order: { createdAt: 'DESC' },
      });

      if (pendingLink) {
        pendingLink.status = PaymentLinkStatus.PAID;
        pendingLink.txHash = txHash;
        pendingLink.paidAt = new Date();
        await this.paymentLinkRepo.save(pendingLink);
      }
    }
  }

  private async getExistingWebhook(webhookUrl: string): Promise<any | null> {
    const res = await fetch(`${this.baseUrl}/webhooks?api-key=${this.apiKey}`);
    const webhooks: any[] = await res.json();
    return webhooks.find(w => w.webhookURL === webhookUrl) || null;
  }

  private async createWebhook(webhookUrl: string, addresses: string[]): Promise<any> {
    const res = await fetch(`${this.baseUrl}/webhooks?api-key=${this.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookURL: webhookUrl,
        transactionTypes: ['TRANSFER'],
        accountAddresses: addresses.length > 0 ? addresses : ['11111111111111111111111111111111'],
        webhookType: 'enhanced',
      }),
    });
    return res.json();
  }

  private async updateWebhook(id: string, webhookUrl: string, addresses: string[]): Promise<any> {
    const res = await fetch(`${this.baseUrl}/webhooks/${id}?api-key=${this.apiKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookURL: webhookUrl,
        transactionTypes: ['TRANSFER'],
        accountAddresses: addresses.length > 0 ? addresses : ['11111111111111111111111111111111'],
        webhookType: 'enhanced',
      }),
    });
    return res.json();
  }
}
