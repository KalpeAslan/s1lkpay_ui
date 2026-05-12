import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateGlobalTransferDto {
  @ApiProperty({ example: 50000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'KZ12345678901234567890' })
  @IsString()
  @IsNotEmpty()
  accountFrom: string;

  @ApiProperty({ example: '123 Main Street, New York, NY 10001' })
  @IsString()
  @IsNotEmpty()
  receiverAddress: string;

  @ApiProperty({ example: 'UNITED STATES OF AMERICA' })
  @IsString()
  @IsNotEmpty()
  receiverCountry: string;

  @ApiProperty({ example: 'USA', required: false })
  @IsString()
  @IsOptional()
  receiverCountryCode?: string;
}

