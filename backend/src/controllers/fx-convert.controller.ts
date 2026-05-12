import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FxConvertService } from '../services/fx-convert.service';
import { CreateFxConvertDto } from '../dto/create-fx-convert.dto';
import { FxConvertWithApplicationDto } from '../dto/fx-convert-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('FX Convert')
@Controller('fx-convert')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FxConvertController {
  constructor(private readonly fxConvertService: FxConvertService) {}

  @Post()
  @ApiOperation({ summary: 'Create FX conversion' })
  @ApiResponse({
    status: 201,
    description: 'Conversion created successfully',
    type: FxConvertWithApplicationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateFxConvertDto, @Request() req) {
    return this.fxConvertService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all FX conversions' })
  @ApiResponse({
    status: 200,
    description: 'Returns all FX conversions',
    type: [FxConvertWithApplicationDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.fxConvertService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get FX conversion by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the FX conversion',
    type: FxConvertWithApplicationDto,
  })
  @ApiResponse({ status: 404, description: 'Conversion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.fxConvertService.findOne(id, req.user.id);
  }
}
