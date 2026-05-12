import { ApiProperty } from '@nestjs/swagger';
import { DomesticTransferResponseDto } from './domestic-transfer-response.dto';
import { GlobalTransferResponseDto } from './global-transfer-response.dto';
import { FxConvertResponseDto } from './fx-convert-response.dto';
import { PaymentOrderResponseDto } from './payment-order-response.dto';

export class ApplicationDetailResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'DT-1704067200000-123' })
  number: string;

  @ApiProperty({
    example: 'DOMESTIC_TRANSFER',
    enum: [
      'DOMESTIC_TRANSFER',
      'GLOBAL_TRANSFER',
      'FX_CONVERT',
      'PAYMENT_ORDER',
    ],
  })
  type: string;

  @ApiProperty({
    example: 'PENDING',
    enum: [
      'PENDING',
      'IN_PROGRESS',
      'APPROVED',
      'REJECTED',
      'COMPLETED',
      'CANCELLED',
    ],
  })
  status: string;

  @ApiProperty({ example: 'Внутренний перевод на Иванов Иван Иванович' })
  description: string;

  @ApiProperty({ example: 100000 })
  amount: number;

  @ApiProperty({ example: 'KZT' })
  currency: string;

  @ApiProperty({ type: DomesticTransferResponseDto, required: false })
  domesticTransfer?: DomesticTransferResponseDto;

  @ApiProperty({ type: GlobalTransferResponseDto, required: false })
  globalTransfer?: GlobalTransferResponseDto;

  @ApiProperty({ type: FxConvertResponseDto, required: false })
  fxConvert?: FxConvertResponseDto;

  @ApiProperty({ type: PaymentOrderResponseDto, required: false })
  paymentOrder?: PaymentOrderResponseDto;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

