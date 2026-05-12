import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  Min,
} from 'class-validator';
import { CryptoToken } from '../entities/payment-link.entity';

export class CreatePaymentLinkDto {
  @ApiProperty({ example: 'Pro plan — June 2026' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Acme Co.', required: false })
  @IsString()
  @IsOptional()
  customerName?: string;

  @ApiProperty({ example: 199.00 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: CryptoToken, example: CryptoToken.USDC, description: 'Preferred token to receive' })
  @IsEnum(CryptoToken)
  token: CryptoToken;

  @ApiProperty({
    example: false,
    required: false,
    description: 'If true, accept payment in any token without conversion',
  })
  @IsBoolean()
  @IsOptional()
  acceptAnyToken?: boolean;

  @ApiProperty({ example: '2026-05-19T16:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: '5z9fabc...ax9Lp' })
  @IsString()
  txHash: string;

  @ApiProperty({ example: 'USDT', required: false, description: 'Token the client actually paid with' })
  @IsString()
  @IsOptional()
  paidWithToken?: string;

  @ApiProperty({ example: 'Please send invoice to billing@acme.co', required: false })
  @IsString()
  @IsOptional()
  customerNote?: string;
}
