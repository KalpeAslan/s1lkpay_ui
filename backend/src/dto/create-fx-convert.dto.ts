import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateFxConvertDto {
  @ApiProperty({ example: 100000 })
  @IsNumber()
  @IsNotEmpty()
  buyAmount: number;

  @ApiProperty({ example: 'KZT' })
  @IsString()
  @IsNotEmpty()
  buyCurrency: string;

  @ApiProperty({ example: 213.5 })
  @IsNumber()
  @IsNotEmpty()
  sellAmount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  sellCurrency: string;

  @ApiProperty({ example: 468.38 })
  @IsNumber()
  @IsNotEmpty()
  exchangeRate: number;
}

