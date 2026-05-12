import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlobalTransfer } from '../entities/global-transfer.entity';
import {
  Application,
  ApplicationStatus,
  OperationType,
} from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { CreateGlobalTransferDto } from '../dto/create-global-transfer.dto';

@Injectable()
export class GlobalTransferService {
  constructor(
    @InjectRepository(GlobalTransfer)
    private globalTransferRepository: Repository<GlobalTransfer>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(dto: CreateGlobalTransferDto, user: User) {
    // Create global transfer
    const transfer = this.globalTransferRepository.create(dto);
    const savedTransfer = await this.globalTransferRepository.save(transfer);

    // Generate application number
    const applicationNumber = `GT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create application
    const application = this.applicationRepository.create({
      number: applicationNumber,
      type: OperationType.GLOBAL_TRANSFER,
      status: ApplicationStatus.PENDING,
      description: `Международный перевод в ${dto.receiverCountry}`,
      amount: dto.amount,
      currency: dto.currency,
      globalTransfer: savedTransfer,
      user,
    });

    const savedApplication =
      await this.applicationRepository.save(application);

    return {
      ...savedApplication,
      globalTransfer: savedTransfer,
    };
  }

  async findAll(userId: string) {
    return this.applicationRepository.find({
      where: { 
        type: OperationType.GLOBAL_TRANSFER,
        user: { id: userId },
      },
      relations: ['globalTransfer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        id,
        user: { id: userId },
      },
      relations: ['globalTransfer'],
    });
  }
}
