import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WalletService } from '../services/wallet.service';
import { User } from '../entities/user.entity';

class WithdrawDto {
  @ApiProperty({ example: 'FzKv...ax9L' })
  @IsString()
  toAddress: string;

  @ApiProperty({ example: 'USDT' })
  @IsString()
  token: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  amount: number;
}

class WithdrawAllDto {
  @ApiProperty({ example: 'FzKv...ax9L' })
  @IsString()
  toAddress: string;
}

class WithdrawFiatDto {
  @ApiProperty({ example: '4111111111111111', description: 'Bank card number' })
  @IsString()
  cardNumber: string;

  @ApiProperty({ example: 'USDT' })
  @IsString()
  token: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  amount: number;
}

@ApiTags('wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balances for all supported tokens' })
  getBalance(@Request() req: { user: User }) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get recent wallet transactions' })
  getTransactions(@Request() req: { user: User }) {
    return this.walletService.getTransactions(req.user.id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export wallet keypair (private key) — use with caution' })
  exportWallet(@Request() req: { user: User }) {
    return this.walletService.exportWallet(req.user.id);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw a specific token to external Solana address' })
  withdraw(@Request() req: { user: User }, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(req.user.id, dto.toAddress, dto.token, dto.amount);
  }

  @Post('withdraw-all')
  @ApiOperation({ summary: 'Withdraw all tokens to external Solana address' })
  withdrawAll(@Request() req: { user: User }, @Body() dto: WithdrawAllDto) {
    return this.walletService.withdrawAll(req.user.id, dto.toAddress);
  }

  @Post('withdraw-fiat')
  @ApiOperation({ summary: 'Convert crypto to fiat and send to bank card (demo)' })
  withdrawFiat(@Request() req: { user: User }, @Body() dto: WithdrawFiatDto) {
    return this.walletService.withdrawFiat(req.user.id, dto.cardNumber, dto.token, dto.amount);
  }
}
