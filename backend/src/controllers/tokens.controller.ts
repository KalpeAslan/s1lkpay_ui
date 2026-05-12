import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SUPPORTED_TOKENS } from '../config/tokens.config';

@ApiTags('tokens')
@Controller('tokens')
export class TokensController {
  @Get()
  @ApiOperation({ summary: 'Get list of all supported tokens with mint addresses' })
  getSupportedTokens() {
    return SUPPORTED_TOKENS;
  }
}
