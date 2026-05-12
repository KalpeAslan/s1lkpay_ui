import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentOrder } from '../entities/payment-order.entity';
import {
  Application,
  ApplicationStatus,
  OperationType,
} from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { CreatePaymentOrderDto } from '../dto/create-payment-order.dto';

@Injectable()
export class PaymentOrderService {
  constructor(
    @InjectRepository(PaymentOrder)
    private paymentOrderRepository: Repository<PaymentOrder>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(dto: CreatePaymentOrderDto, user: User) {
    // Create payment order
    const order = this.paymentOrderRepository.create(dto);
    const savedOrder = await this.paymentOrderRepository.save(order);

    // Generate application number
    const applicationNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create application
    const application = this.applicationRepository.create({
      number: applicationNumber,
      type: OperationType.PAYMENT_ORDER,
      status: ApplicationStatus.PENDING,
      description: `Платежное поручение КНП: ${dto.knp}`,
      amount: dto.amount,
      currency: dto.currency,
      paymentOrder: savedOrder,
      user,
    });

    const savedApplication =
      await this.applicationRepository.save(application);

    return {
      ...savedApplication,
      paymentOrder: savedOrder,
    };
  }

  async findAll(userId: string) {
    return this.applicationRepository.find({
      where: { 
        type: OperationType.PAYMENT_ORDER,
        user: { id: userId },
      },
      relations: ['paymentOrder'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        id,
        user: { id: userId },
      },
      relations: ['paymentOrder'],
    });
  }
}
