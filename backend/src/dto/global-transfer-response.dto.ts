import { ApiProperty } from '@nestjs/swagger';
import { ApplicationResponseDto } from './domestic-transfer-response.dto';

export class GlobalTransferResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 50000 })
  amount: number;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: 'KZ12345678901234567890' })
  accountFrom: string;

  @ApiProperty({ example: '123 Main Street, New York, NY 10001' })
  receiverAddress: string;

  @ApiProperty({ example: 'UNITED STATES OF AMERICA' })
  receiverCountry: string;

  @ApiProperty({ example: 'USA', required: false })
  receiverCountryCode?: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class GlobalTransferWithApplicationDto extends ApplicationResponseDto {
  @ApiProperty({ type: GlobalTransferResponseDto })
  globalTransfer: GlobalTransferResponseDto;
}

