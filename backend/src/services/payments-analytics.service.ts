import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentLink, PaymentLinkStatus } from '../entities/payment-link.entity';

@Injectable()
export class PaymentsAnalyticsService {
  constructor(
    @InjectRepository(PaymentLink)
    private repo: Repository<PaymentLink>,
  ) {}

  async getAnalytics(userId: string, days: number = 14) {
    const allLinks = await this.repo.find({
      where: { user: { id: userId } },
      order: { paidAt: 'DESC' },
    });

    const paid = allLinks.filter(l => l.status === PaymentLinkStatus.PAID);
    const pending = allLinks.filter(l => l.status === PaymentLinkStatus.PENDING);

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const paidInRange = paid.filter(l => l.paidAt && l.paidAt >= cutoff);

    const totalIncome = paid.reduce((sum, l) => sum + Number(l.amount), 0);
    const pendingAmount = pending.reduce((sum, l) => sum + Number(l.amount), 0);
    const avgPayment = paid.length > 0 ? totalIncome / paid.length : 0;

    const incomeByToken = this.calcIncomeByToken(paid);
    const incomeByDay = this.calcIncomeByDay(paid, days);

    const prevCutoff = new Date(cutoff);
    prevCutoff.setDate(prevCutoff.getDate() - days);
    const prevPaid = paid.filter(l => l.paidAt && l.paidAt >= prevCutoff && l.paidAt < cutoff);
    const prevTotal = prevPaid.reduce((sum, l) => sum + Number(l.amount), 0);
    const growthPercent = prevTotal > 0
      ? Math.round(((totalIncome - prevTotal) / prevTotal) * 100 * 10) / 10
      : 0;

    return {
      totalIncome,
      growthPercent,
      successfulPayments: paid.length,
      totalLinks: allLinks.length,
      pendingPayments: pending.length,
      pendingAmount,
      avgPayment: Math.round(avgPayment * 100) / 100,
      incomeByDay,
      incomeByToken,
      transactions: paid.map(l => ({
        txHash: l.txHash,
        description: l.description,
        customerName: l.customerName,
        amount: l.amount,
        token: l.token,
        paidOn: l.paidAt,
      })),
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
}
