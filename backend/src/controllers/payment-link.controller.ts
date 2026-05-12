import {
  Controller, Get, Post, Body, Param, Query,
  UseGuards, Request, Res, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PaymentLinkService } from '../services/payment-link.service';
import { CreatePaymentLinkDto } from '../dto/payment-link.dto';
import { User } from '../entities/user.entity';

@ApiTags('payment-links')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-links')
export class PaymentLinkController {
  constructor(private readonly service: PaymentLinkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment link' })
  create(@Body() dto: CreatePaymentLinkDto, @Request() req: { user: User }) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment links with optional filters' })
  @ApiQuery({ name: 'status', required: false, description: 'pending | paid | expired | all' })
  @ApiQuery({ name: 'token', required: false, description: 'USDC | USDT | SOL | all' })
  findAll(
    @Request() req: { user: User },
    @Query('status') status?: string,
    @Query('token') token?: string,
  ) {
    return this.service.findAll(req.user.id, status, token);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export payment links as CSV' })
  async exportCsv(@Request() req: { user: User }, @Res() res: Response) {
    const csv = await this.service.exportCsv(req.user.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="payment-links.csv"');
    res.status(HttpStatus.OK).send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment link detail with QR code' })
  findOne(@Param('id') id: string, @Request() req: { user: User }) {
    return this.service.findOne(id, req.user.id);
  }

  @Post(':id/simulate')
  @ApiOperation({ summary: 'Simulate a payment (for demo/testing)' })
  simulate(@Param('id') id: string, @Request() req: { user: User }) {
    return this.service.simulate(id, req.user.id);
  }
}
