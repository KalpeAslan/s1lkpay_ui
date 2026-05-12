import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class UpdateSettingsDto {
  @ApiProperty({ example: 'Sandbox Merchant', required: false })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({ example: 'support@sandbox.s1lk.pay', required: false })
  @IsEmail()
  @IsOptional()
  supportEmail?: string;

  @ApiProperty({ example: 'https://example.com', required: false })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty({ example: 'FzKv...ax9L', required: false })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({ example: ['USDC', 'USDT', 'SOL'], required: false })
  @IsArray()
  @IsOptional()
  acceptedTokens?: string[];

  @ApiProperty({ example: 'Solana · Mainnet', required: false })
  @IsString()
  @IsOptional()
  network?: string;
}
