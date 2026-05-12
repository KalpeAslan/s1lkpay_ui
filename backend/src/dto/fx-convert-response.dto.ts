import { ApiProperty } from '@nestjs/swagger';
import { ApplicationResponseDto } from './domestic-transfer-response.dto';

export class FxConvertResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 100000 })
  buyAmount: number;

  @ApiProperty({ example: 'KZT' })
  buyCurrency: string;

  @ApiProperty({ example: 213.5 })
  sellAmount: number;

  @ApiProperty({ example: 'USD' })
  sellCurrency: string;

  @ApiProperty({ example: 468.38 })
  exchangeRate: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

export class FxConvertWithApplicationDto extends ApplicationResponseDto {
  @ApiProperty({ type: FxConvertResponseDto })
  fxConvert: FxConvertResponseDto;
}

