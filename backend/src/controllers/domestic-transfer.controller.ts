import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DomesticTransferService } from '../services/domestic-transfer.service';
import { CreateDomesticTransferDto } from '../dto/create-domestic-transfer.dto';
import { DomesticTransferWithApplicationDto } from '../dto/domestic-transfer-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Domestic Transfers')
@Controller('domestic-transfers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DomesticTransferController {
  constructor(
    private readonly domesticTransferService: DomesticTransferService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create domestic transfer' })
  @ApiResponse({
    status: 201,
    description: 'Transfer created successfully',
    type: DomesticTransferWithApplicationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateDomesticTransferDto, @Request() req) {
    return this.domesticTransferService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all domestic transfers' })
  @ApiResponse({
    status: 200,
    description: 'Returns all domestic transfers',
    type: [DomesticTransferWithApplicationDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.domesticTransferService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get domestic transfer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the domestic transfer',
    type: DomesticTransferWithApplicationDto,
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.domesticTransferService.findOne(id, req.user.id);
  }
}
