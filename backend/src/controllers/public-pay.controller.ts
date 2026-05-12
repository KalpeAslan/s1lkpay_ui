import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentLinkService } from '../services/payment-link.service';
import { ConfirmPaymentDto } from '../dto/payment-link.dto';

@ApiTags('public-pay')
@Controller('pay')
export class PublicPayController {
  constructor(private readonly service: PaymentLinkService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get public payment page data (no auth required)' })
  getPayPage(@Param('slug') slug: string) {
    return this.service.findBySlug(slug);
  }

  @Post(':slug/confirm')
  @ApiOperation({ summary: 'Client submits tx hash to confirm payment' })
  confirmPayment(@Param('slug') slug: string, @Body() dto: ConfirmPaymentDto) {
    return this.service.confirm(slug, dto);
  }
}
