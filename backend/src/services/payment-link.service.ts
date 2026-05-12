import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import { PaymentLink, PaymentLinkStatus, CryptoToken } from '../entities/payment-link.entity';
import { Wallet } from '../entities/wallet.entity';
import { User } from '../entities/user.entity';
import { CreatePaymentLinkDto, ConfirmPaymentDto } from '../dto/payment-link.dto';
import { ConversionService } from './conversion.service';

const CRYPTO_RATES: Record<CryptoToken, number> = {
  [CryptoToken.USDC]: 1,
  [CryptoToken.USDT]: 1,
  [CryptoToken.SOL]: 152.5,
  [CryptoToken.KZTE]: 0.002,
  [CryptoToken.PEPE]: 0.000012,
};

function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'pl_';
  for (let i = 0; i < 8; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

@Injectable()
export class PaymentLinkService {
  constructor(
    @InjectRepository(PaymentLink)
    private repo: Repository<PaymentLink>,
    @InjectRepository(Wallet)
    private walletRepo: Repository<Wallet>,
    private conversionService: ConversionService,
  ) {}

  async create(dto: CreatePaymentLinkDto, user: User): Promise<PaymentLink> {
    let slug = generateSlug();
    while (await this.repo.findOne({ where: { slug } })) {
      slug = generateSlug();
    }

    const rate = CRYPTO_RATES[dto.token] ?? 1;
    const cryptoAmount = (dto.token === CryptoToken.SOL || rate < 1)
      ? Number((dto.amount / rate).toFixed(6))
      : dto.amount;

    const wallet = await this.walletRepo.findOne({ where: { userId: user.id } });

    const link = this.repo.create({
      slug,
      description: dto.description,
      customerName: dto.customerName,
      amount: dto.amount,
      token: dto.token,
      cryptoAmount,
      acceptAnyToken: dto.acceptAnyToken ?? false,
      network: user.network || 'Solana · Mainnet',
      walletAddress: wallet?.publicKey ?? undefined,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      status: PaymentLinkStatus.PENDING,
      user,
    });

    return this.repo.save(link) as unknown as Promise<PaymentLink>;
  }

  async findAll(userId: string, status?: string, token?: string) {
    const where: any = { user: { id: userId } };
    if (status && status !== 'all') where.status = status;
    if (token && token !== 'all') where.token = token;

    await this.expireOldLinks(userId);

    const links = await this.repo.find({
      where,
      order: { createdAt: 'DESC' },
    });

    const counts = await this.repo
      .createQueryBuilder('pl')
      .select('pl.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('pl.user = :userId', { userId })
      .groupBy('pl.status')
      .getRawMany();

    const total = await this.repo.count({ where: { user: { id: userId } } });

    return { links, counts, total };
  }

  async findOne(id: string, userId: string) {
    const link = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!link) throw new NotFoundException('Payment link not found');

    const payUrl = `https://pay.s1lk.app/${link.slug}`;
    const qrCode = await QRCode.toDataURL(payUrl);

    return { ...link, payUrl, qrCode };
  }

  async findBySlug(slug: string) {
    const link = await this.repo.findOne({
      where: { slug },
      relations: ['user'],
    });
    if (!link) throw new NotFoundException('Payment link not found');

    if (link.status === PaymentLinkStatus.PENDING && link.deadline && new Date() > link.deadline) {
      link.status = PaymentLinkStatus.EXPIRED;
      await this.repo.save(link);
    }

    const conversionInfo = link.acceptAnyToken
      ? { mode: 'any', message: 'This merchant accepts any supported token' }
      : { mode: 'fixed', requiredToken: link.token, requiredAmount: link.cryptoAmount };

    return { ...link, conversionInfo };
  }

  async confirm(slug: string, dto: ConfirmPaymentDto) {
    const link = await this.repo.findOne({ where: { slug } });
    if (!link) throw new NotFoundException('Payment link not found');
    if (link.status !== PaymentLinkStatus.PENDING) {
      throw new BadRequestException(`Payment link is already ${link.status}`);
    }

    const paidWithToken = dto.paidWithToken || link.token;
    let conversionResult: any = null;

    if (!link.acceptAnyToken && paidWithToken !== link.token) {
      conversionResult = this.conversionService.convert(
        paidWithToken,
        link.cryptoAmount,
        link.token,
      );
    }

    link.status = PaymentLinkStatus.PAID;
    link.txHash = dto.txHash;
    link.paidAt = new Date();
    link.paidWithToken = paidWithToken;
    if (dto.customerNote) link.customerNote = dto.customerNote;

    await this.repo.save(link);
    return { ...link, conversionResult };
  }

  async simulate(id: string, userId: string) {
    const link = await this.repo.findOne({ where: { id, user: { id: userId } } });
    if (!link) throw new NotFoundException('Payment link not found');
    if (link.status !== PaymentLinkStatus.PENDING) {
      throw new BadRequestException(`Payment link is already ${link.status}`);
    }

    link.status = PaymentLinkStatus.PAID;
    link.txHash = this.randomTxHash();
    link.paidAt = new Date();
    link.paidWithToken = link.token;

    return this.repo.save(link);
  }

  async exportCsv(userId: string): Promise<string> {
    const { links } = await this.findAll(userId);
    const header = 'slug,description,customer,amount,token,acceptAnyToken,status,created,deadline';
    const rows = links.map(l =>
      [l.slug, l.description, l.customerName, l.amount, l.token, l.acceptAnyToken,
       l.status, l.createdAt.toISOString(), l.deadline?.toISOString() ?? ''].join(',')
    );
    return [header, ...rows].join('\n');
  }

  private randomTxHash(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 44 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private async expireOldLinks(userId: string) {
    await this.repo
      .createQueryBuilder()
      .update(PaymentLink)
      .set({ status: PaymentLinkStatus.EXPIRED })
      .where(
        'status = :status AND deadline < :now AND "userId" = :userId',
        { status: PaymentLinkStatus.PENDING, now: new Date(), userId },
      )
      .execute();
  }
}
