import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HeliusWebhookService } from '../services/helius-webhook.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly heliusWebhookService: HeliusWebhookService) {}

  @Post('helius')
  @ApiOperation({ summary: 'Helius webhook endpoint (called by Helius on payment)' })
  async handleHeliusWebhook(@Body() events: any[]) {
    this.logger.log(`Received ${events?.length ?? 0} Helius events`);
    await this.heliusWebhookService.handlePayment(events || []);
    return { received: true };
  }
}
