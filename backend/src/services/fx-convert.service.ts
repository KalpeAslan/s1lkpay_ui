import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FxConvert } from '../entities/fx-convert.entity';
import {
  Application,
  ApplicationStatus,
  OperationType,
} from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { CreateFxConvertDto } from '../dto/create-fx-convert.dto';

@Injectable()
export class FxConvertService {
  constructor(
    @InjectRepository(FxConvert)
    private fxConvertRepository: Repository<FxConvert>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(dto: CreateFxConvertDto, user: User) {
    // Create FX conversion
    const convert = this.fxConvertRepository.create(dto);
    const savedConvert = await this.fxConvertRepository.save(convert);

    // Generate application number
    const applicationNumber = `FX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create application
    const application = this.applicationRepository.create({
      number: applicationNumber,
      type: OperationType.FX_CONVERT,
      status: ApplicationStatus.PENDING,
      description: `Конвертация ${dto.sellCurrency} в ${dto.buyCurrency}`,
      amount: dto.buyAmount,
      currency: dto.buyCurrency,
      fxConvert: savedConvert,
      user,
    });

    const savedApplication =
      await this.applicationRepository.save(application);

    return {
      ...savedApplication,
      fxConvert: savedConvert,
    };
  }

  async findAll(userId: string) {
    return this.applicationRepository.find({
      where: { 
        type: OperationType.FX_CONVERT,
        user: { id: userId },
      },
      relations: ['fxConvert'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        id,
        user: { id: userId },
      },
      relations: ['fxConvert'],
    });
  }
}
