import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationService } from '../services/application.service';
import { ApplicationDetailResponseDto } from '../dto/application-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all applications' })
  @ApiResponse({
    status: 200,
    description: 'Returns all applications',
    type: [ApplicationDetailResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Request() req) {
    return this.applicationService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the application',
    type: ApplicationDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.applicationService.findOne(id, req.user.id);
  }

  @Get('number/:number')
  @ApiOperation({ summary: 'Get application by number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the application',
    type: ApplicationDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByNumber(@Param('number') number: string, @Request() req) {
    return this.applicationService.findByNumber(number, req.user.id);
  }
}
