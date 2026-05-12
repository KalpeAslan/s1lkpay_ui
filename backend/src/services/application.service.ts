import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async findAll(userId: string) {
    return this.applicationRepository.find({
      where: { user: { id: userId } },
      relations: [
        'domesticTransfer',
        'globalTransfer',
        'fxConvert',
        'paymentOrder',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        id,
        user: { id: userId },
      },
      relations: [
        'domesticTransfer',
        'globalTransfer',
        'fxConvert',
        'paymentOrder',
      ],
    });
  }

  async findByNumber(number: string, userId: string) {
    return this.applicationRepository.findOne({
      where: { 
        number,
        user: { id: userId },
      },
      relations: [
        'domesticTransfer',
        'globalTransfer',
        'fxConvert',
        'paymentOrder',
      ],
    });
  }
}
