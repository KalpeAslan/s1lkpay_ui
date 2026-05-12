import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLink, PaymentLinkStatus, CryptoToken } from '../entities/payment-link.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(PaymentLink)
    private repo: Repository<PaymentLink>,
  ) {}

  async getDashboard(userId: string) {
    const allLinks = await this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const paid = allLinks.filter(l => l.status === PaymentLinkStatus.PAID);
    const pending = allLinks.filter(l => l.status === PaymentLinkStatus.PENDING);

    const totalReceived = paid.reduce((sum, l) => sum + Number(l.amount), 0);
    const pendingAmount = pending.reduce((sum, l) => sum + Number(l.amount), 0);
    const successRate = allLinks.length > 0
      ? Math.round((paid.length / allLinks.length) * 100)
      : 0;

    const incomeByToken = this.calcIncomeByToken(paid);
    const incomeByDay = this.calcIncomeByDay(paid, 14);
    const recentActivity = allLinks.slice(0, 6);

    const prev14Total = this.calcPrev14Total(paid);
    const growthPercent = prev14Total > 0
      ? Math.round(((totalReceived - prev14Total) / prev14Total) * 100 * 10) / 10
      : 0;

    return {
      totalReceived,
      growthPercent,
      successfulPayments: paid.length,
      totalLinks: allLinks.length,
      successRate,
      pendingAmount,
      pendingCount: pending.length,
      avgSettlement: 2.1,
      incomeByDay,
      incomeByToken,
      recentActivity,
    };
  }

  private calcIncomeByToken(paid: PaymentLink[]) {
    const totals: Record<string, number> = {};
    const total = paid.reduce((sum, l) => sum + Number(l.amount), 0);

    for (const l of paid) {
      totals[l.token] = (totals[l.token] || 0) + Number(l.amount);
    }

    return Object.entries(totals).map(([token, amount]) => ({
      token,
      amount,
      percent: total > 0 ? Math.round((amount / total) * 100) : 0,
    }));
  }

  private calcIncomeByDay(paid: PaymentLink[], days: number) {
    const result: { date: string; amount: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const amount = paid
        .filter(l => l.paidAt && l.paidAt.toISOString().split('T')[0] === dateStr)
        .reduce((sum, l) => sum + Number(l.amount), 0);

      result.push({ date: dateStr, amount });
    }

    return result;
  }

  private calcPrev14Total(paid: PaymentLink[]): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 14);
    const prev = new Date(cutoff);
    prev.setDate(prev.getDate() - 14);

    return paid
      .filter(l => l.paidAt && l.paidAt >= prev && l.paidAt < cutoff)
      .reduce((sum, l) => sum + Number(l.amount), 0);
  }
}
