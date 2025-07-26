import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { ReportsRepository } from './repositories/reports.repository';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async create(
    createReportDto: CreateReportDto,
    userId: string,
  ): Promise<Report> {
    return this.reportsRepository.create(createReportDto, userId);
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.findAll();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOne(id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async findByUser(userId: string): Promise<Report[]> {
    return this.reportsRepository.findByUser(userId);
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.reportsRepository.update(id, updateReportDto);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.reportsRepository.softDelete(id);
    if (!deleted) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }

  async findByMakeAndModel(make: string, model: string): Promise<Report[]> {
    return this.reportsRepository.findByMakeAndModel(make, model);
  }

  async findByYearRange(minYear: number, maxYear: number): Promise<Report[]> {
    return this.reportsRepository.findByYearRange(minYear, maxYear);
  }

  async findApprovedReports(): Promise<Report[]> {
    return this.reportsRepository.findApprovedReports();
  }

  async getAveragePrice(
    make: string,
    model: string,
    year?: number,
  ): Promise<number> {
    return this.reportsRepository.findAveragePrice(make, model, year);
  }

  async approveReport(id: string): Promise<Report> {
    return this.update(id, { isApproved: true });
  }
}
