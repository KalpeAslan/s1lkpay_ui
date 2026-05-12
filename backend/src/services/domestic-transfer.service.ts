import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomesticTransfer } from '../entities/domestic-transfer.entity';
import {
  Application,
  ApplicationStatus,
  OperationType,
} from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { CreateDomesticTransferDto } from '../dto/create-domestic-transfer.dto';

@Injectable()
export class DomesticTransferService {
  constructor(
    @InjectRepository(DomesticTransfer)
    private domesticTransferRepository: Repository<DomesticTransfer>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(dto: CreateDomesticTransferDto, user: User) {
    // Create domestic transfer
    const transfer = this.domesticTransferRepository.create(dto);
    const savedTransfer = await this.domesticTransferRepository.save(transfer);

    // Generate application number
    const applicationNumber = `DT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create application
    const application = this.applicationRepository.create({
      number: applicationNumber,
      type: OperationType.DOMESTIC_TRANSFER,
      status: ApplicationStatus.PENDING,
      description: `Внутренний перевод на ${dto.companyName}`,
      amount: dto.amount,
      currency: 'KZT', // Default currency for domestic transfers
      domesticTransfer: savedTransfer,
      user,
    });

    const savedApplication =
      await this.applicationRepository.save(application);

    return {
      ...savedApplication,
      domesticTransfer: savedTransfer,
    };
  }

  async findAll(userId: string) {
    return this.applicationRepository.find({
      where: { 
        type: OperationType.DOMESTIC_TRANSFER,
        user: { id: userId },
      },
      relations: ['domesticTransfer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        id,
        user: { id: userId },
      },
      relations: ['domesticTransfer'],
    });
  }
}

