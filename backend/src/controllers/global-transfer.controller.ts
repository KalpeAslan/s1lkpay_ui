import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GlobalTransferService } from '../services/global-transfer.service';
import { CreateGlobalTransferDto } from '../dto/create-global-transfer.dto';
import { GlobalTransferWithApplicationDto } from '../dto/global-transfer-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Global Transfers')
@Controller('global-transfers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GlobalTransferController {
  constructor(private readonly globalTransferService: GlobalTransferService) {}

  @Post()
  @ApiOperation({ summary: 'Create global transfer' })
  @ApiResponse({
    status: 201,
    description: 'Transfer created successfully',
    type: GlobalTransferWithApplicationDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateGlobalTransferDto, @Request() req) {
    return this.globalTransferService.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all global transfers' })
  @ApiResponse({
    status: 200,
    description: 'Returns all global transfers',
    type: [GlobalTransferWithApplicationDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.globalTransferService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get global transfer by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the global transfer',
    type: GlobalTransferWithApplicationDto,
  })
  @ApiResponse({ status: 404, description: 'Transfer not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.globalTransferService.findOne(id, req.user.id);
  }
}
