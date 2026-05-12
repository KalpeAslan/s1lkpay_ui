import { ApiProperty } from '@nestjs/swagger';

export class DomesticTransferResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'IIN' })
  recipientType: string;

  @ApiProperty({ example: '010908550522' })
  recipientId: string;

  @ApiProperty({ example: 'MyIndividual' })
  companyName: string;

  @ApiProperty({ example: 'KZ23432423423' })
  accountNumber: string;

  @ApiProperty({ example: '12324234234' })
  bic: string;

  @ApiProperty({ example: '12' })
  kbe: string;

  @ApiProperty({ example: 12312 })
  amount: number;

  @ApiProperty({ example: '123222' })
  paymentPurpose: string;

  @ApiProperty({ example: '41223' })
  paymentDetails: string;

  @ApiProperty({ example: 1, required: false })
  currentStep?: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class ApplicationResponseDto {
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

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class DomesticTransferWithApplicationDto extends ApplicationResponseDto {
  @ApiProperty({ type: DomesticTransferResponseDto })
  domesticTransfer: DomesticTransferResponseDto;
}

