import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentOrderService } from '../services/payment-order.service';
import { CreatePaymentOrderDto } from '../dto/create-payment-order.dto';
import { PaymentOrderWithApplicationDto } from '../dto/payment-order-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Payment Orders')
@Controller('payment-orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentOrderController {
  constructor(private readonly paymentOrderService: PaymentOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create payment order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: PaymentOrderWithApplicationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreatePaymentOrderDto, @Request() req) {
    return this.paymentOrderService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment orders' })
  @ApiResponse({
    status: 200,
    description: 'Returns all payment orders',
    type: [PaymentOrderWithApplicationDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.paymentOrderService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment order',
    type: PaymentOrderWithApplicationDto,
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.paymentOrderService.findOne(id, req.user.id);
  }
}
