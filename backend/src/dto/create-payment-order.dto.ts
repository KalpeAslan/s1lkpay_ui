import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePaymentOrderDto {
  @ApiProperty({ example: '002' })
  @IsString()
  @IsNotEmpty()
  knp: string;

  @ApiProperty({ example: '1111' })
  @IsString()
  @IsNotEmpty()
  kvo: string;

  @ApiProperty({ example: 'Дополнительная информация', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'KZT' })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

