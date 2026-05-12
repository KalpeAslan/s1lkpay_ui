import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsIn } from 'class-validator';

export class CreateDomesticTransferDto {
  @ApiProperty({ example: 'IIN', enum: ['IIN', 'BIN'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['IIN', 'BIN'])
  recipientType: string;

  @ApiProperty({ example: '010908550522' })
  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @ApiProperty({ example: 'MyIndividual' })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({ example: 'KZ23432423423' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: '12324234234' })
  @IsString()
  @IsNotEmpty()
  bic: string;

  @ApiProperty({ example: '12' })
  @IsString()
  @IsNotEmpty()
  kbe: string;

  @ApiProperty({ example: 12312 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '123222' })
  @IsString()
  @IsNotEmpty()
  paymentPurpose: string;

  @ApiProperty({ example: '41223' })
  @IsString()
  @IsNotEmpty()
  paymentDetails: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  currentStep?: number;
}

