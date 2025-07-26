import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Body() createReportDto: CreateReportDto,
    @Query('userId') userId: string,
  ) {
    return this.reportsService.create(createReportDto, userId);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get('approved')
  findApproved() {
    return this.reportsService.findApprovedReports();
  }

  @Get('by-user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reportsService.findByUser(userId);
  }

  @Get('by-make-model')
  findByMakeAndModel(
    @Query('make') make: string,
    @Query('model') model: string,
  ) {
    return this.reportsService.findByMakeAndModel(make, model);
  }

  @Get('by-year-range')
  findByYearRange(
    @Query('minYear') minYear: number,
    @Query('maxYear') maxYear: number,
  ) {
    return this.reportsService.findByYearRange(minYear, maxYear);
  }

  @Get('average-price')
  getAveragePrice(
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('year') year?: number,
  ) {
    return this.reportsService.getAveragePrice(make, model, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.reportsService.approveReport(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }
}
