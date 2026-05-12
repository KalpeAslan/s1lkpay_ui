import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingsDto } from '../dto/settings.dto';
import { User } from '../entities/user.entity';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user settings' })
  getSettings(@Request() req: { user: User }) {
    return this.service.getSettings(req.user);
  }

  @Put()
  @ApiOperation({ summary: 'Update user settings' })
  updateSettings(@Request() req: { user: User }, @Body() dto: UpdateSettingsDto) {
    return this.service.updateSettings(req.user, dto);
  }
}
