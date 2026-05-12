import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateSettingsDto } from '../dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async getSettings(user: User) {
    const { password, ...settings } = user;
    return settings;
  }

  async updateSettings(user: User, dto: UpdateSettingsDto) {
    await this.userRepo.update(user.id, dto);
    const updated = await this.userRepo.findOne({ where: { id: user.id } });
    if (!updated) return {};
    const { password, ...settings } = updated;
    return settings;
  }
}
