import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentsAnalyticsService } from '../services/payments-analytics.service';
import { User } from '../entities/user.entity';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsAnalyticsController {
  constructor(private readonly service: PaymentsAnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get payments analytics' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days (default 14)' })
  getAnalytics(
    @Request() req: { user: User },
    @Query('days') days?: string,
  ) {
    return this.service.getAnalytics(req.user.id, days ? parseInt(days) : 14);
  }
}
