import { ApiProperty } from '@nestjs/swagger';
import { ApplicationResponseDto } from './domestic-transfer-response.dto';

export class PaymentOrderResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: '002' })
  knp: string;

  @ApiProperty({ example: '1111' })
  kvo: string;

  @ApiProperty({ example: 'Дополнительная информация', required: false })
  message?: string;

  @ApiProperty({ example: 500000 })
  amount: number;

  @ApiProperty({ example: 'KZT' })
  currency: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class PaymentOrderWithApplicationDto extends ApplicationResponseDto {
  @ApiProperty({ type: PaymentOrderResponseDto })
  paymentOrder: PaymentOrderResponseDto;
}

